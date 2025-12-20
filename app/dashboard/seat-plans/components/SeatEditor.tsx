"use client";

import { Input, InputNumber, Modal, Button, Dropdown, Select } from "antd";
import { useState, useMemo, useEffect, useRef } from "react";
import { FiEdit2, FiX, FiPlus } from "react-icons/fi";
import type { MenuProps } from "antd";

interface Seat {
  row: number;
  column: number;
  seatNumber: number;
  seatName?: string;
  isBroken?: boolean;
  isAisle?: boolean; // If true, this seat is a road (walkway)
}

interface SeatEditorProps {
  value?: Seat[];
  rows?: number;
  columns?: number;
  aisleColumns?: number[];
  onChange?: (seats: Seat[]) => void;
  onRowsChange?: (rows: number) => void;
  onColumnsChange?: (columns: number) => void;
  onAisleColumnsChange?: (aisleColumns: number[]) => void;
  readOnly?: boolean; // If true, disable all editing controls
  allowRowRemoval?: boolean; // If false, hide row removal buttons (default: true)
}

export function SeatEditor({
  value = [],
  rows: initialRows = 10,
  columns: initialColumns = 5,
  aisleColumns: initialAisleColumns = [],
  onChange,
  onRowsChange,
  onColumnsChange,
  onAisleColumnsChange,
  readOnly = false,
  allowRowRemoval = true,
}: SeatEditorProps) {
  const [seats, setSeats] = useState<Seat[]>(value);
  const [rows, setRows] = useState(initialRows);
  const [columns, setColumns] = useState(initialColumns);
  const [aisleColumns, setAisleColumns] = useState<number[]>(initialAisleColumns);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; column: number } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editingRowCells, setEditingRowCells] = useState<{ [key: string]: string }>({});
  const [addingRow, setAddingRow] = useState(false);
  const [newRowInputs, setNewRowInputs] = useState<{ [key: number]: string }>({});
  const [editingAll, setEditingAll] = useState(false);
  const [editingAllCells, setEditingAllCells] = useState<{ [key: string]: string }>({});
  const prevValueRef = useRef<string>("");
  const isSyncingRef = useRef(false);

  // Sync with external value changes
  useEffect(() => {
    const valueStr = JSON.stringify(value || []);
    if (valueStr !== prevValueRef.current) {
      prevValueRef.current = valueStr;
      isSyncingRef.current = true;
      setSeats(value || []);
      // Reset sync flag after state update
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 0);
    }
  }, [value]);

  useEffect(() => {
    if (initialRows) setRows(initialRows);
  }, [initialRows]);

  useEffect(() => {
    if (initialColumns) setColumns(initialColumns);
  }, [initialColumns]);

  useEffect(() => {
    // Sync aisleColumns with prop changes
    if (Array.isArray(initialAisleColumns)) {
      setAisleColumns((prev) => {
        const prevSorted = [...prev].sort((a, b) => a - b);
        const newSorted = [...initialAisleColumns].sort((a, b) => a - b);
        const prevStr = JSON.stringify(prevSorted);
        const newStr = JSON.stringify(newSorted);
        if (prevStr !== newStr) {
          return initialAisleColumns;
        }
        return prev;
      });
    }
  }, [initialAisleColumns]);

  // Generate grid layout
  const grid = useMemo(() => {
    const gridData: (Seat | null)[][] = [];
    
    for (let r = 0; r < rows; r++) {
      const row: (Seat | null)[] = [];
      for (let c = 0; c < columns; c++) {
        const seat = seats.find((s) => s.row === r && s.column === c);
        row.push(seat || null);
      }
      gridData.push(row);
    }
    
    return gridData;
  }, [rows, columns, seats]);

  const handleRowsChange = (newRows: number) => {
    setRows(newRows);
    onRowsChange?.(newRows);
    // Remove seats that are beyond new row count
    const filteredSeats = seats.filter((s) => s.row < newRows);
    setSeats(filteredSeats);
    onChange?.(filteredSeats);
  };

  const handleColumnsChange = (newColumns: number) => {
    setColumns(newColumns);
    onColumnsChange?.(newColumns);
    // Remove seats that are beyond new column count
    const filteredSeats = seats.filter((s) => s.column < newColumns);
    // Update aisle columns to be within new column range
    const filteredAisleColumns = aisleColumns.filter((ac) => ac < newColumns);
    setAisleColumns(filteredAisleColumns);
    onAisleColumnsChange?.(filteredAisleColumns);
    setSeats(filteredSeats);
    onChange?.(filteredSeats);
  };

  const toggleRoadColumn = (column: number) => {
    // Use current state to determine if it's a road column
    const currentAisleColumns = [...aisleColumns];
    const isCurrentlyRoad = currentAisleColumns.includes(column);

    if (isCurrentlyRoad) {
      // Turn road column back into normal seats: remove from aisleColumns and clear road flags
      const newRoadColumns = currentAisleColumns.filter((ac) => ac !== column);
      setAisleColumns(newRoadColumns);
      onAisleColumnsChange?.(newRoadColumns);

      // Remove road seats from this column
      const updatedSeats = seats.filter((s) => !(s.column === column && s.isAisle));
      setSeats(updatedSeats);
      onChange?.(updatedSeats);
    } else {
      // Make this entire column a road
      const newRoadColumns = [...currentAisleColumns, column].sort((a, b) => a - b);
      setAisleColumns(newRoadColumns);
      onAisleColumnsChange?.(newRoadColumns);

      // Remove existing seats from this column and create road seats for all rows
      const filteredSeats = seats.filter((s) => s.column !== column);
      const roadSeats: Seat[] = [];

      for (let r = 0; r < rows; r++) {
        roadSeats.push({
          row: r,
          column,
          seatNumber: 0, // seatNumber not used for roads
          isAisle: true,
        });
      }

      const newSeats = [...filteredSeats, ...roadSeats];
      setSeats(newSeats);
      onChange?.(newSeats);
    }
  };

  const toggleSeat = (row: number, column: number) => {
    const existingSeat = seats.find((s) => s.row === row && s.column === column);
    if (existingSeat?.isAisle) return; // Can't remove road seat this way, use right-click menu
    
    if (existingSeat) {
      // Remove seat
      const newSeats = seats.filter((s) => !(s.row === row && s.column === column));
      setSeats(newSeats);
      onChange?.(newSeats);
    } else {
      // Add new seat
      const maxSeatNumber = seats.length > 0 ? Math.max(...seats.map((s) => s.seatNumber)) : 0;
      const newSeat: Seat = {
        row,
        column,
        seatNumber: maxSeatNumber + 1,
        isBroken: false,
      };
      const newSeats = [...seats, newSeat];
      setSeats(newSeats);
      onChange?.(newSeats);
    }
  };

  const toggleBroken = (row: number, column: number) => {
    const seat = seats.find((s) => s.row === row && s.column === column);
    if (seat) {
      const updatedSeats = seats.map((s) =>
        s.row === row && s.column === column ? { ...s, isBroken: !s.isBroken } : s
      );
      setSeats(updatedSeats);
      onChange?.(updatedSeats);
    }
  };

  const handleDoubleClick = (row: number, column: number, seat: Seat | null) => {
    if (seat) {
      setEditingCell({ row, column });
      setEditValue(seat.seatName || seat.seatNumber.toString());
    } else {
      // Double-click empty cell to add seat
      setEditingCell({ row, column });
      setEditValue("");
    }
  };

  const handleEditSave = (row: number, column: number, seat: Seat | null) => {
    // Prevent multiple calls
    if (!editingCell || editingCell.row !== row || editingCell.column !== column) {
      return;
    }

    const value = editValue.trim();
    
    if (seat) {
      // Editing existing seat
      if (value) {
        // Update seat name
        const updatedSeats = seats.map((s) =>
          s.row === row && s.column === column
            ? { ...s, seatName: value || undefined }
            : s
        );
        setSeats(updatedSeats);
        onChange?.(updatedSeats);
      } else {
        // Remove seat name (keep seat with just number)
        const updatedSeats = seats.map((s) =>
          s.row === row && s.column === column
            ? { ...s, seatName: undefined }
            : s
        );
        setSeats(updatedSeats);
        onChange?.(updatedSeats);
      }
    } else {
      // Creating new seat - always create even if value is empty
      // Check if seat already exists at this position (shouldn't happen, but defensive)
      const existingSeat = seats.find((s) => s.row === row && s.column === column);
      if (!existingSeat) {
        const maxSeatNumber = seats.length > 0 ? Math.max(...seats.map((s) => s.seatNumber)) : 0;
        const newSeat: Seat = {
          row,
          column,
          seatNumber: maxSeatNumber + 1,
          seatName: value || undefined,
          isBroken: false,
        };
        const newSeats = [...seats, newSeat];
        setSeats(newSeats);
        onChange?.(newSeats);
      }
    }

    // Clear editing state after a small delay to ensure state updates
    setTimeout(() => {
      setEditingCell(null);
      setEditValue("");
    }, 0);
  };

  const toggleRowEdit = (rowIndex: number) => {
    if (editingRow === rowIndex) {
      // Save all changes and exit edit mode
      const rowSeats = seats.filter((s) => s.row === rowIndex);
      let updatedSeats = [...seats];
      
      // Update existing seats and create new ones
      Object.keys(editingRowCells).forEach((key) => {
        const [r, c] = key.split('-').map(Number);
        const value = editingRowCells[key].trim();
        const existingSeat = rowSeats.find((s) => s.row === r && s.column === c);
        
        if (existingSeat) {
          if (value) {
            updatedSeats = updatedSeats.map((s) =>
              s.row === r && s.column === c
                ? { ...s, seatName: value || undefined }
                : s
            );
          } else {
            // Remove seat name but keep seat
            updatedSeats = updatedSeats.map((s) =>
              s.row === r && s.column === c
                ? { ...s, seatName: undefined }
                : s
            );
          }
        } else if (value) {
          // Create new seat
          const maxSeatNumber = seats.length > 0 ? Math.max(...seats.map((s) => s.seatNumber)) : 0;
          const newSeat: Seat = {
            row: r,
            column: c,
            seatNumber: maxSeatNumber + 1,
            seatName: value,
            isBroken: false,
          };
          updatedSeats = [...updatedSeats, newSeat];
        }
      });
      
      // Remove seats that were cleared (empty values)
      rowSeats.forEach((seat) => {
        const key = `${seat.row}-${seat.column}`;
        if (editingRowCells[key] !== undefined && !editingRowCells[key].trim()) {
          updatedSeats = updatedSeats.filter((s) => !(s.row === seat.row && s.column === seat.column));
        }
      });
      
      setSeats(updatedSeats);
      onChange?.(updatedSeats);
      setEditingRow(null);
      setEditingRowCells({});
    } else {
      // Enter edit mode - initialize all cells in the row
      const rowSeats = seats.filter((s) => s.row === rowIndex);
      const initialValues: { [key: string]: string } = {};
      
      for (let c = 0; c < columns; c++) {
        if (!aisleColumns.includes(c)) {
          const seat = rowSeats.find((s) => s.column === c);
          initialValues[`${rowIndex}-${c}`] = seat ? (seat.seatName || seat.seatNumber.toString()) : "";
        }
      }
      
      setEditingRowCells(initialValues);
      setEditingRow(rowIndex);
    }
  };

  const openAddRowModal = () => {
    const initialInputs: { [key: number]: string } = {};
    for (let c = 0; c < columns; c++) {
      if (!aisleColumns.includes(c)) {
        initialInputs[c] = "";
      }
    }
    setNewRowInputs(initialInputs);
    setAddingRow(true);
  };

  const applyAddRow = () => {
    const newRowIndex = rows;
    let updatedSeats = [...seats];
    let seatCounter = seats.length > 0 ? Math.max(...seats.map((s) => s.seatNumber)) : 0;

    Object.keys(newRowInputs).forEach((colStr) => {
      const col = Number(colStr);
      const value = newRowInputs[col].trim();
      
      if (value) {
        const valueUpper = value.toUpperCase();
        
        if (valueUpper === "XX") {
          // Broken seat
          seatCounter++;
          updatedSeats.push({
            row: newRowIndex,
            column: col,
            seatNumber: seatCounter,
            isBroken: true,
          });
        } else if (valueUpper !== "XY") {
          // Regular seat (XY is road, skip it)
          seatCounter++;
          updatedSeats.push({
            row: newRowIndex,
            column: col,
            seatNumber: seatCounter,
            seatName: value,
            isBroken: false,
          });
        }
      }
    });

    // Increase rows count
    const newRows = rows + 1;
    setRows(newRows);
    onRowsChange?.(newRows);
    
    setSeats(updatedSeats);
    onChange?.(updatedSeats);
    setAddingRow(false);
    setNewRowInputs({});
  };

  const toggleEditAll = () => {
    if (editingAll) {
      // Save all changes and exit edit mode
      let updatedSeats = [...seats];
      let seatCounter = seats.length > 0 ? Math.max(...seats.map((s) => s.seatNumber)) : 0;
      
      // Update existing seats and create new ones
      Object.keys(editingAllCells).forEach((key) => {
        const [r, c] = key.split('-').map(Number);
        const value = editingAllCells[key].trim();
        const existingSeat = seats.find((s) => s.row === r && s.column === c);
        
        if (existingSeat) {
          if (value) {
            updatedSeats = updatedSeats.map((s) =>
              s.row === r && s.column === c
                ? { ...s, seatName: value || undefined }
                : s
            );
          } else {
            // Remove seat name but keep seat
            updatedSeats = updatedSeats.map((s) =>
              s.row === r && s.column === c
                ? { ...s, seatName: undefined }
                : s
            );
          }
        } else if (value) {
          // Create new seat
          seatCounter++;
          const newSeat: Seat = {
            row: r,
            column: c,
            seatNumber: seatCounter,
            seatName: value,
            isBroken: false,
          };
          updatedSeats = [...updatedSeats, newSeat];
        }
      });
      
      // Remove seats that were cleared (empty values)
      seats.forEach((seat) => {
        const key = `${seat.row}-${seat.column}`;
        if (editingAllCells[key] !== undefined && !editingAllCells[key].trim()) {
          updatedSeats = updatedSeats.filter((s) => !(s.row === seat.row && s.column === seat.column));
        }
      });
      
      setSeats(updatedSeats);
      onChange?.(updatedSeats);
      setEditingAll(false);
      setEditingAllCells({});
    } else {
      // Enter edit all mode - initialize all cells
      const initialValues: { [key: string]: string } = {};
      
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          const seat = seats.find((s) => s.row === r && s.column === c);
          if (seat && !seat.isAisle) {
            initialValues[`${r}-${c}`] = seat.seatName || seat.seatNumber.toString();
          } else if (!seat) {
            initialValues[`${r}-${c}`] = "";
          }
        }
      }
      
      setEditingAllCells(initialValues);
      setEditingAll(true);
    }
  };

  const renderCell = (row: number, column: number) => {
    const cellData = grid[row][column];
    const seat = cellData || null;
    const isRoad = seat?.isAisle === true;

    if (isRoad) {
      const roadMenuItems: MenuProps["items"] = [
        {
          key: "removeRoad",
          label: "Remove Road Column",
          danger: true,
          onClick: () => {
            // Remove all roads from this column (since roads are typically entire columns)
            const updatedSeats = seats.filter((s) => !(s.column === column && s.isAisle === true));
            setSeats(updatedSeats);
            onChange?.(updatedSeats);
            
            // Remove column from aisleColumns if it's there
            if (aisleColumns.includes(column)) {
              const newRoadColumns = aisleColumns.filter((ac) => ac !== column);
              setAisleColumns(newRoadColumns);
              onAisleColumnsChange?.(newRoadColumns);
            }
          },
        },
      ];

      if (readOnly) {
        return (
          <div
            key={`${row}-${column}`}
            className="flex h-16 w-16 items-center justify-center border-2 border-dashed border-slate-400 bg-slate-200 dark:border-slate-600 dark:bg-slate-700"
            title="Road"
          >
            <span className="text-base text-slate-500 dark:text-slate-400">🚶</span>
          </div>
        );
      }

      return (
        <Dropdown
          key={`${row}-${column}`}
          menu={{ items: roadMenuItems }}
          trigger={["contextMenu"]}
        >
          <div
            className="flex h-16 w-16 cursor-pointer items-center justify-center border-2 border-dashed border-slate-400 bg-slate-200 dark:border-slate-600 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
            title="Road - Right-click to remove"
          >
            <span className="text-base text-slate-500 dark:text-slate-400">🚶</span>
          </div>
        </Dropdown>
      );
    }

    // Check if this is a real seat (not a road)
    const isEditing = editingCell?.row === row && editingCell?.column === column;
    const isRowEditing = editingRow === row;
    const isEditingAll = editingAll;
    const cellKey = `${row}-${column}`;

    if (isEditingAll) {
      return (
        <Input
          key={`${row}-${column}`}
          value={editingAllCells[cellKey] || ""}
          onChange={(e) => {
            setEditingAllCells({
              ...editingAllCells,
              [cellKey]: e.target.value,
            });
          }}
          placeholder="+"
          className="h-16 w-16 text-center text-base font-medium p-0"
          style={{ 
            textAlign: "center",
            height: "64px",
            width: "64px",
            padding: 0
          }}
          onClick={(e) => e.stopPropagation()}
        />
      );
    }

    if (isRowEditing) {
      return (
        <Input
          key={`${row}-${column}`}
          value={editingRowCells[cellKey] || ""}
          onChange={(e) => {
            setEditingRowCells({
              ...editingRowCells,
              [cellKey]: e.target.value,
            });
          }}
          placeholder="+"
          className="h-16 w-16 text-center text-base font-medium p-0"
          style={{ 
            textAlign: "center",
            height: "64px",
            width: "64px",
            padding: 0
          }}
          onClick={(e) => e.stopPropagation()}
        />
      );
    }

    if (isEditing) {
      return (
        <Input
          key={`${row}-${column}`}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onPressEnter={(e) => {
            e.preventDefault();
            handleEditSave(row, column, seat);
          }}
          onBlur={(e) => {
            // Small delay to allow Enter key to process first
            setTimeout(() => {
              handleEditSave(row, column, seat);
            }, 100);
          }}
          autoFocus
          className="h-16 w-16 text-center text-base font-medium p-0"
          style={{ 
            textAlign: "center",
            height: "64px",
            width: "64px",
            padding: 0
          }}
          onClick={(e) => e.stopPropagation()}
        />
      );
    }

    if (seat) {
      const menuItems: MenuProps["items"] = [
        {
          key: "toggleBroken",
          label: seat.isBroken ? "Mark as Working" : "Mark as Broken",
          onClick: () => toggleBroken(row, column),
        },
        {
          key: "remove",
          label: "Remove Seat",
          danger: true,
          onClick: () => toggleSeat(row, column),
        },
        {
          key: "makeRoad",
          label: "Make Road",
          onClick: () => {
            // Convert this seat to a road
            const updatedSeats = seats.map((s) =>
              s.row === row && s.column === column
                ? { ...s, isAisle: true }
                : s
            );
            setSeats(updatedSeats);
            onChange?.(updatedSeats);
            
            // Add column to aisleColumns if not already there
            if (!aisleColumns.includes(column)) {
              const newRoadColumns = [...aisleColumns, column].sort((a, b) => a - b);
              setAisleColumns(newRoadColumns);
              onAisleColumnsChange?.(newRoadColumns);
            }
          },
        },
      ];

      if (readOnly) {
        return (
          <div
            key={`${row}-${column}`}
            className={`group relative flex h-16 w-16 items-center justify-center rounded border text-base font-medium shadow-sm ${
              seat.isBroken
                ? "border-red-400 bg-red-100 text-red-700 line-through dark:border-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            }`}
            title={`Seat ${seat.seatName || seat.seatNumber}${seat.isBroken ? " (Broken)" : ""}`}
          >
            {seat.seatName || seat.seatNumber}
            {seat.isBroken && (
              <span className="absolute -top-1 -right-1 text-red-500">⚠️</span>
            )}
          </div>
        );
      }

      return (
        <Dropdown
          key={`${row}-${column}`}
          menu={{ items: menuItems }}
          trigger={["contextMenu"]}
        >
          <div
            className={`group relative flex h-16 w-16 cursor-pointer items-center justify-center rounded border text-base font-medium shadow-sm transition-all ${
              seat.isBroken
                ? "border-red-400 bg-red-100 text-red-700 line-through dark:border-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "border-slate-300 bg-slate-50 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20"
            }`}
            onDoubleClick={() => handleDoubleClick(row, column, seat)}
            title={`Seat ${seat.seatName || seat.seatNumber}${seat.isBroken ? " (Broken)" : ""} - Double-click to edit, right-click for menu`}
          >
            {seat.seatName || seat.seatNumber}
            {seat.isBroken && (
              <span className="absolute -top-1 -right-1 text-red-500">⚠️</span>
            )}
          </div>
        </Dropdown>
      );
    }

    return (
      <div
        key={`${row}-${column}`}
        className={`flex h-16 w-16 items-center justify-center rounded border border-dashed border-slate-300 bg-transparent text-slate-400 ${
          readOnly 
            ? "" 
            : "cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-400 dark:hover:border-indigo-500"
        } dark:border-slate-600`}
        onDoubleClick={readOnly ? undefined : () => handleDoubleClick(row, column, null)}
        title={readOnly ? "Empty seat" : "Double-click to add seat"}
      >
        <span className="text-lg">+</span>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex flex-wrap items-center gap-4">
          {!readOnly && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-600 dark:text-white dark:text-slate-300">
                Road Columns:
              </label>
              <div className="flex gap-1">
                {Array.from({ length: columns }, (_, i) => {
                  const isRoad = aisleColumns.includes(i);
                  return (
                    <Button
                      key={i}
                      size="small"
                      type={isRoad ? "primary" : "default"}
                      danger={isRoad}
                      onClick={() => toggleRoadColumn(i)}
                      className="h-7 w-7 p-0"
                      title={isRoad ? `Column ${i + 1} is a road - Click to remove` : `Column ${i + 1} - Click to make it a road`}
                    >
                      {i + 1}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {!readOnly && (
          <div className="flex items-center gap-2">
            <Button
              type="default"
              icon={<FiPlus />}
              onClick={openAddRowModal}
              size="small"
            >
              Add Row
            </Button>
            <Button
              type={editingAll ? "primary" : "default"}
              icon={<FiEdit2 />}
              onClick={toggleEditAll}
              size="small"
            >
              {editingAll ? "Save All" : "Edit All"}
            </Button>
          </div>
        )}
      </div>

      {/* Seat Plan Layout - Centered */}
      <div className="flex flex-col items-center">
        {/* Bus Front Indicator */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-100 px-4 py-2 dark:bg-indigo-900/20">
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              🚌 Front
            </span>
          </div>
        </div>

        {/* Seat Grid */}
        <div className="overflow-x-auto w-full flex justify-center">
          <div className="inline-block">
            {/* Rows */}
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="mb-1 flex items-center gap-1">
                {/* Cells */}
                {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
                {/* Row Actions */}
                {!readOnly && (
                  <div className="ml-2 flex gap-1">
                    <Button
                      type={editingRow === rowIndex ? "primary" : "text"}
                      size="small"
                      icon={<FiEdit2 style={{ color: editingRow === rowIndex ? "#fff" : "#2563eb" }} />}
                      onClick={() => toggleRowEdit(rowIndex)}
                      className="h-8 w-8 p-0"
                      title={editingRow === rowIndex ? "Save row" : "Edit row"}
                    />
                    {allowRowRemoval && (
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<FiX />}
                        onClick={() => {
                          // Remove all seats in this row
                          const newSeats = seats.filter((s) => s.row !== rowIndex);
                          setSeats(newSeats);
                          onChange?.(newSeats);
                        }}
                        className="h-8 w-8 p-0"
                        title="Delete all seats in this row"
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bus Back Indicator */}
        <div className="mt-4">
          <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 dark:bg-slate-800">
            <span className="text-sm font-medium text-slate-600 dark:text-white dark:text-slate-300">
              ⬇️ Back
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"></div>
          <span className="text-xs text-slate-600 dark:text-white dark:text-slate-300">
            Seat (double-click to edit, right-click for menu)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded border border-red-400 bg-red-100 dark:border-red-600 dark:bg-red-900/30"></div>
          <span className="text-xs text-slate-600 dark:text-white dark:text-slate-300">Broken Seat</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded border-2 border-dashed border-slate-400 bg-slate-200 dark:bg-slate-700"></div>
          <span className="text-xs text-slate-600 dark:text-white dark:text-slate-300">Road</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded border border-dashed border-slate-300 dark:border-slate-600"></div>
          <span className="text-xs text-slate-600 dark:text-white dark:text-slate-300">Empty (double-click to add)</span>
        </div>
      </div>

      {/* Add Row Modal */}
      <Modal
        title="Add New Row"
        open={addingRow}
        onOk={applyAddRow}
        onCancel={() => {
          setAddingRow(false);
          setNewRowInputs({});
        }}
        width={800}
        style={{ top: 20 }}
      >
        <div className="py-4">
          <div className="mb-4 text-sm text-slate-600 dark:text-white dark:text-slate-300">
            Enter seat names for each column (leave empty to skip, use XX for broken seat, XY for road):
          </div>
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: columns }, (_, i) => {
              if (aisleColumns.includes(i)) {
                return (
                  <div key={i} className="flex flex-col">
                    <label className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      Col {i + 1} (Road)
                    </label>
                    <Input
                      value="🚶"
                      disabled
                      className="text-center"
                    />
                  </div>
                );
              }
              return (
                <div key={i} className="flex flex-col">
                  <label className="mb-2 text-xs font-medium text-slate-600 dark:text-white dark:text-slate-300">
                    Column {i + 1}
                  </label>
                  <Input
                    value={newRowInputs[i] || ""}
                    onChange={(e) => {
                      setNewRowInputs({
                        ...newRowInputs,
                        [i]: e.target.value,
                      });
                    }}
                    placeholder="A1 or XX"
                    onPressEnter={applyAddRow}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:text-white dark:bg-slate-800 dark:text-slate-400">
            <p className="mb-2 font-semibold">Pattern Format:</p>
            <ul className="list-inside list-disc space-y-1">
              <li><code className="rounded bg-slate-200 px-1 py-0.5 dark:bg-slate-700">A1, A2, A3</code> - Seat names</li>
              <li><code className="rounded bg-slate-200 px-1 py-0.5 dark:bg-slate-700">XX</code> - Broken seat</li>
              <li><code className="rounded bg-slate-200 px-1 py-0.5 dark:bg-slate-700">XY</code> - Road (aisle) - will be skipped</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}
