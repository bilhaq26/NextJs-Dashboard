// ** React Imports
import { useState, ChangeEvent, Key } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'

interface Column {
  id: 'index' | 'nama' | 'actions' // Modify the column definitions
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'index', label: 'No', minWidth: 50 },
  { id: 'nama', label: 'Jenis Api', minWidth: 170 },
  { id: 'actions', label: 'Actions', minWidth: 100 }
]

interface Data {
  id: number // Change the data structure
  nama: string
}

function createData(index: number, nama: string, slug: string): Data {
  return { id: index + 1, nama, slug }
}

const TableJenisApi = ({ data, handleDeleteClick, handleEditClick }) => {
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(data || [])
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: { [x: string]: any }, index: number) => {
                const rowIndex = page * rowsPerPage + index + 1

                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={rowIndex}>
                    {columns.map(column => {
                      const value =
                        column.id === 'index' ? (
                          rowIndex
                        ) : column.id === 'actions' ? (
                          <>
                            <Button variant='contained' onClick={() => handleEditClick(row.id)}>
                              <Icon icon='tabler:edit' />
                            </Button>
                            &nbsp;
                            <Button variant='contained' color='error' onClick={() => handleDeleteClick(row.id)}>
                              <Icon icon='tabler:trash' />
                            </Button>
                          </>
                        ) : (
                          row[column.id]
                        )

                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={(data || []).length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default TableJenisApi
