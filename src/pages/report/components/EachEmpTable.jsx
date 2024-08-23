import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";

const EachEmpTable = ({ data }) => {
  if (!data) {
    return null; // Return nothing if no data is provided
  }

  const statusColor = (fconfirm) => {
    switch (fconfirm) {
      case 'N':
        return 'bg-red-500'; // Not Confirmed
      case 'Y':
        return 'bg-green-500'; // Confirmed
      default:
        return '';
    }
  };

  const getStatusText = (fconfirm) => {
    return fconfirm === 'Y' ? 'Confirmed' : 'Not Confirmed';
  };

  return (
    <Table className="mt-6 border-4 border-amber-100 bg-gradient-to-r from-[#e6e9f0] via-[#e6e9f0] to-[#fbc8d4] text-black text-lg rounded-xl">
      <TableCaption>Employee Data</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-fit">Employee Number</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Surname</TableHead>
          <TableHead className="text-right">Prize</TableHead>
          <TableHead className="text-center">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">{data.fempno}</TableCell>
          <TableCell>{data.fempname}</TableCell>
          <TableCell>{data.fsurname}</TableCell>
          <TableCell className="text-right">{data.fprizename}</TableCell>
          <TableCell className="text-center">
            <Badge className={statusColor(data.fconfirm)}>
              {getStatusText(data.fconfirm)}
            </Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

EachEmpTable.propTypes = {
  data: PropTypes.shape({
    fempno: PropTypes.string.isRequired,
    fempname: PropTypes.string.isRequired,
    fsurname: PropTypes.string.isRequired,
    fprizename: PropTypes.string.isRequired,
    fconfirm: PropTypes.string.isRequired,
  }).isRequired,
};

export default EachEmpTable;
