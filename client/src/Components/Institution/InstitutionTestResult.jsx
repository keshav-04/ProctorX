import React, { useState, useEffect } from 'react';
import Footer from '../Common/Footer';
import Navbar from '../Common/Navbar';
import { Card, CardHeader, CardBody, CardFooter, Typography, Button } from '@material-tailwind/react'; // Import your component library
import fetchAPI from '../Tools/FetchAPI';

const InstituteTestResult = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'anshul', marks: 2, cgpa: 9.8, phoneNo: '1234567890', batch: '2021', course: 'Computer Science' },
    // { id: 2, name: 'Alice', marks: 90, cgpa: 9.0, phoneNo: '9876543210', batch: '2022', course: 'Electrical Engineering' },
    // { id: 3, name: 'Bob', marks: 75, cgpa: 7.5, phoneNo: '2345678901', batch: '2024', course: 'Mechanical Engineering' },
    // { id: 4, name: 'Eve', marks: 88, cgpa: 8.8, phoneNo: '8901234567', batch: '2023', course: 'Civil Engineering' },
    // { id: 5, name: 'Charlie', marks: 92, cgpa: 9.2, phoneNo: '3456789012', batch: '2022', course: 'Chemical Engineering' },
  ]);

  const [testid, setTestId] = useState('')
  const [mean, setMean] = useState(0);
  const [median, setMedian] = useState(0);
  const [mode, setMode] = useState(0);
  const [highestScorer, setHighestScorer] = useState({});
  const [aboveAverageCount, setAboveAverageCount] = useState(0);
  const [belowAverageCount, setBelowAverageCount] = useState(0);

  let api = `http://localhost:8000/api`
  useEffect(() => {
    const fetchResult = async () => {
      let response = await fetchAPI(`${api}/testresult?test_id=${testid}`, {}, "GET", false)
      if (response.ok) {
        let students = response.result
        for (let i = 0; i < students.length; i++) {
          students[i] = {
            id: i + 1,
            name: students[i].name,
            marks: parseInt(students[i].score),
            cgpa: students[i].cgpa,
            phoneNo: students[i].phoneNo,
            batch: students[i].batch,
            course: students[i].course
          }
        }
        setStudents(students)
      }
      else {
        // error statement
      }
    }
  }, [])
  useEffect(() => {
    calculateMean(students);
    calculateMedian(students);
    calculateMode(students);
    findHighestScorer(students);
    countAboveBelowAverage(students);
  }, [students]);

  // Calculate Mean
  const calculateMean = (data) => {
    const totalMarks = data.reduce((acc, curr) => acc + curr.marks, 0);
    const meanValue = totalMarks / data.length;
    setMean(meanValue.toFixed(2));
  };

  // Calculate Median
  const calculateMedian = (data) => {
    const sortedMarks = data.map((student) => student.marks).sort((a, b) => a - b);
    const mid = Math.floor(sortedMarks.length / 2);
    const medianValue =
      sortedMarks.length % 2 !== 0 ? sortedMarks[mid] : (sortedMarks[mid - 1] + sortedMarks[mid]) / 2;
    setMedian(medianValue.toFixed(2));
  };

  // Calculate Mode
  const calculateMode = (data) => {
    const counts = {};
    data.forEach((student) => {
      counts[student.marks] = (counts[student.marks] || 0) + 1;
    });
    const modeValue = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
    setMode(modeValue);
  };

  // Find Highest Scorer
  const findHighestScorer = (data) => {
    const highest = data.reduce((prev, current) => (prev.marks > current.marks ? prev : current), {});
    setHighestScorer(highest);
  };

  // Count Above and Below Average
  const countAboveBelowAverage = (data) => {
    const aboveAverage = data.filter((student) => student.marks > mean).length;
    const belowAverage = data.length - aboveAverage;
    setAboveAverageCount(aboveAverage);
    setBelowAverageCount(belowAverage);
  };

  return (
    <div>
      <Navbar />
      <div className="mt-8 flex items-center justify-center">
        <Card className="w-full md:w-4/4 lg:w-1/2 xl:w-1/2">
          <CardHeader
            variant="gradient"
            color="gray"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Student Marks
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <table className="w-full mb-8 table-auto sm:w-auto md:w-full lg:w-auto xl:w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-6 py-3 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    CGPA
                  </th>
                  <th className="px-6 py-3 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="px-6 py-3 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Course
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="border px-6 py-4">{student.name}</td>
                    <td className="border px-6 py-4">{student.marks}</td>
                    <td className="border px-6 py-4">{student.cgpa}</td>
                    <td className="border px-6 py-4">{student.phoneNo}</td>
                    <td className="border px-6 py-4">{student.batch}</td>
                    <td className="border px-6 py-4">{student.course}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-sm font-medium">Mean:</p>
                <p className="text-lg font-semibold">{mean}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Median:</p>
                <p className="text-lg font-semibold">{median}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Mode:</p>
                <p className="text-lg font-semibold">{mode}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium">Highest Scorer:</p>
              <p className="text-lg font-semibold">{highestScorer.name} - {highestScorer.marks}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium">Students above Average:</p>
              <p className="text-lg font-semibold">{aboveAverageCount}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Students below Average:</p>
              <p className="text-lg font-semibold">{belowAverageCount}</p>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            {/* Footer content here */}
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default InstituteTestResult;
