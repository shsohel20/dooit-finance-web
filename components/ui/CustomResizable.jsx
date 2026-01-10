'use client';
import { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { cn } from '@/lib/utils';

const CustomResizableTable = ({
  className,
  mainClass,
  tableId = '1111',
  columns,
  data,
  loading,
  ...props
}) => {
  const tables = document.getElementsByClassName(mainClass);
  const resizableGrid = (table) => {
    if (!table) return;
    const tableHeight = table.offsetHeight;
    table.style.overflow = 'hidden';

    const row = table.getElementsByTagName('tr')[0];
    const cols = row ? row.children : undefined;
    if (!cols) return;

    const paddingDiff = (col) => {
      const getStyleVal = (elm, css) =>
        window.getComputedStyle(elm, null).getPropertyValue(css);
      if (getStyleVal(col, 'box-sizing') === 'border-box') return 0;

      const padLeft = getStyleVal(col, 'padding-left');
      const padRight = getStyleVal(col, 'padding-right');
      return parseInt(padLeft) + parseInt(padRight);
    };

    const setListeners = (div) => {
      let pageX, curCol, curColWidth, tableWidth;

      const handleMouseDown = (e) => {
        const tableElement = document.getElementById(tableId);
        if (!tableElement) return;

        tableWidth = tableElement.offsetWidth;
        curCol = e.target.parentElement;
        pageX = e.pageX;
        const padding = paddingDiff(curCol);
        curColWidth = curCol.offsetWidth - padding;
      };

      const handleMouseMove = (e) => {
        const tableElement = document.getElementById(tableId);
        if (curCol && tableElement) {
          const diffX = e.pageX - pageX;
          curCol.style.width = `${curColWidth + diffX}px`;
          tableElement.style.width = `${tableWidth + diffX}px`;
        }
      };

      const handleMouseUp = () => {
        curCol = undefined;
        pageX = undefined;
        curColWidth = undefined;
      };

      div.addEventListener('mousedown', handleMouseDown);
      div.addEventListener(
        'mouseover',
        (e) => (e.target.style.borderRight = '3px solid lightgray')
      );
      div.addEventListener(
        'mouseout',
        (e) => (e.target.style.borderRight = '')
      );

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      // Cleanup event listeners on unmount
      return () => {
        div.removeEventListener('mousedown', handleMouseDown);
        div.removeEventListener(
          'mouseover',
          (e) => (e.target.style.borderRight = '3px solid #FBBC06')
        );
        div.removeEventListener(
          'mouseout',
          (e) => (e.target.style.borderRight = '')
        );

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    };

    const createDiv = (height) => {
      const div = document.createElement('div');
      div.style.top = 0;
      div.style.right = 0;
      div.style.width = '5px';
      div.style.boxSizing = 'border-box';
      div.style.position = 'absolute';
      div.style.cursor = 'col-resize';
      div.style.userSelect = 'none';
      div.style.height = `${height}px`;
      return div;
    };

    for (let i = 0; i < cols.length; i++) {
      const div = createDiv(tableHeight);
      cols[i].appendChild(div);
      cols[i].style.position = 'relative';
      setListeners(div);
    }
  };

  useEffect(() => {
    if (tables.length === 0) return;
    for (let i = 0; i < tables.length; i++) {
      resizableGrid(tables[i]);
    }
  }, [tableId]);

  return (
    <div>
      <Table
        id={tableId}
        className={cn(mainClass, className, 'w-full  border ')}
        {...props}
      >
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={'font-bold bg-primary/10 text-primary'}
              >
                {typeof column.header === 'function'
                  ? column.header({ column })
                  : column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length > 0 ? (
            data?.map((row, index) => {
              return (
                <TableRow key={row.id || index}>
                  {columns.map((column) => {
                    return (
                      <TableCell key={column.id}>
                        {column.cell
                          ? column.cell({
                              row: {
                                original: row,
                              },
                            })
                          : row[column.accessorKey]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomResizableTable;
