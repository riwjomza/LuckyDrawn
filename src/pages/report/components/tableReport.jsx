import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Badge } from "../../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

const TableReport = ({ prizeName }) => {

  const [winners, setWinners] = useState([]);

  useEffect(() => {
    if (prizeName) {
      fetch(`http://10.50.10.5:8000/Service_Riw.svc/rest/ShowLuckyEmp/${prizeName}`)
        .then(response => response.json())
        .then(data => setWinners(data.ShowLuckyEmpResult))
        .catch(error => console.error("Error fetching winners:", error));
    }
  }, [prizeName]);

  console.log(11,prizeName)
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
    <>
      <Table className="mt-6 border-4 border-amber-100 bg-gradient-to-r from-[#e6e9f0] via-[#e6e9f0] to-[#fbc8d4]  text-black text-lg rounded-xl">
        <TableCaption>A list of the winners.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-fit">รหัสพนักงาน</TableHead>
            <TableHead>ชื่อ</TableHead>
            <TableHead>นามสกุล</TableHead>
            <TableHead className="text-right">รางวัลที่ได้รับ</TableHead>
            <TableHead className="text-center">สถานะ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {winners.map((winner, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{winner.fempno}</TableCell>
              <TableCell>{winner.fempname}</TableCell>
              <TableCell>{winner.fsurname}</TableCell>
              <TableCell className="text-right">{winner.fprizename}</TableCell>
              <TableCell className="text-center">
                <Badge className={statusColor(winner.fconfirm)}>
                  {getStatusText(winner.fconfirm)}
                </Badge>
              </TableCell>
              {/* <Edit className="h-6 w-6 mx-2 my-4" /> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

TableReport.propTypes = {
  prizeName: PropTypes.string.isRequired,
};

export default TableReport