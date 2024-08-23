import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import TableReport from "./tableReport";
import EachEmpTable from "./EachEmpTable";

const ReportPrize = () => {
  const [selectedPrize, setSelectedPrize] = useState('');
  const [en, setEn] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [empData, setEmpData] = useState(null);
  const [showTableReport, setShowTableReport] = useState(true); // Control which table to show

  const handlePrizeChange = (event) => {
    setSelectedPrize(event.target.value);
    setShowTableReport(true); // Show TableReport when prize changes
    setEmpData(null); // Clear employee data
  };

  const handleCheck = (event) => {
    event.preventDefault();
    
    // Construct the API URL
    const url = `http://10.50.10.5:8000/Service_Riw.svc/rest/ShowEachEmp/${en},${name},${department}`;

    // Fetch the employee data based on user inputs
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setEmpData(data.ShowEachEmpResult[0]); // Assuming you want the first result
        setShowTableReport(false); // Show EachEmpTable when employee data is fetched
      })
      .catch(error => console.error("Error fetching employee data:", error));
  };

  return (
    <>
      <Card className="w-[700px]">
        <CardHeader>
          <CardTitle className="text-center">Lucky Draw Report</CardTitle>
          <CardDescription>Enter only EN.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheck}>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="prize">Prize</Label>
              <select
                id="prize"
                className="mb-3 w-full rounded-2xl bg-zinc-100 outline-cyan-400 px-5 py-3"
                value={selectedPrize}
                onChange={handlePrizeChange}
              >
                <option value="">Select an item</option>
                <option value="Money">เงินรางวัล 5,000฿</option>
                <option value="Headphone">หูฟังเทพ</option>
                <option value="MysteryGift">Mystery Gift</option>
              </select>
            </div>
            <div className="grid mt-4 w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="en">EN</Label>
                <Input
                  id="en"
                  placeholder="EN Number"
                  value={en}
                  onChange={(e) => setEn(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name-Surname</Label>
                <Input
                  id="name"
                  placeholder="Name-Surname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </div>
            <CardFooter className="mt-4 flex justify-center items-start">
              <Button type="submit">Check</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {showTableReport && selectedPrize && (
        <TableReport prizeName={selectedPrize} />
      )}

      {!showTableReport && empData && (
        <EachEmpTable
          data={{
            fempno: empData.fempno,
            fempname: empData.fempname,
            fsurname: empData.fsurname,
            fprizename: empData.fprizename,
            fconfirm: empData.fconfirm
          }}
        />
      )}
    </>
  );
};

export default ReportPrize;
