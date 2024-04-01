import React, { useState, useEffect } from "react";
import { Button, Input } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import profileImage from "../../Assets/profile_image.jpg"; // Import the image
import Cookies from "js-cookie"; // Import Cookies
import DialogBox from "../Common/DialogBox";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = useState({});

  const [image, setImage] = useState(null);

  const [upcomingTests, setUpcomingTests] = useState([]);

 
  const [pastTests, setPastTests] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  useEffect(() => {
    // Fetch student profile and tests data on component mount
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
     
      const accessToken = Cookies.get("access");

      if (!accessToken) {
        console.log("Access token not found, User not authorized");
        navigate("/student/login");
        return;
      }

      const res = await fetch(`http://127.0.0.1:8000/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setStudentDetails({
          name: data.name,
          bio: data.bio,
        });

       
        console.log(data.upcomingtests);
        console.log(data.pasttests);
        setUpcomingTests(data.upcomingtests);
        setPastTests(data.pasttests);
      } else {
        console.error("Failed to fetch student profile data");
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    // Handle image upload logic here
    setImage(URL.createObjectURL(file));
  };


  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog
  };
  const handleAttemptTest = () => {
  
    navigate("/student/starttest");
  };

  const handleViewAnalysis = () => {
    navigate("/student/result");

 

  return (
    <div className="h-screen ">
      <Navbar />
      <div className="flex flex-col flex-grow p-4">
        <div className="text-2xl font-bold mb-4 text-center">
          Student Dashboard
        </div>
        <div className="flex flex-row">
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="flex-1">
              <img
                src={image || profileImage}
                alt="Student"
                className="m-4 w-48 h-48 object-cover border-4 border-black"
              />
              <input
                type="file"
                accept="image/*"
                className="m-10"
                onChange={handleImageUpload}
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="text-4xl text-center font-bold mb-2">
              {studentDetails.name}
            </div>
            <div className="text-2xl text-center m-4">{studentDetails.bio}</div>
            <div className="w-25 items-center">

              <div className="mt-4 px-3 w-full">
             
                {isDialogOpen && <DialogBox onClose={handleCloseDialog} />}
              </div>

            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="flex-1 mt-8">
          <div className="mt-8 mb-8">

            {upcomingTests.length > 0 ? (
              <>
                <h2 className="text-xl font-bold mb-2">Upcoming Tests</h2>
                <table className="border-collapse border border-black w-full">
                  <thead>
                    <tr>
                      <th className="border border-black px-4 py-2">Sr No.</th>
                      <th className="border border-black px-4 py-2">
                        Test Title
                      </th>
                      <th className="border border-black px-4 py-2">
                        Start Time
                      </th>
                      <th className="border border-black px-4 py-2">
                        Duration
                      </th>
                      <th className="border border-black px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingTests.map((test, index) => (
                      <tr key={test.id}>
                        <td className="border border-black px-4 py-2">
                          {index + 1}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {test.title}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {test.start}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {test.duration}
                        </td>
                        <td className="border border-black px-4 py-2">
                          <Button
                            color="blue"
                            ripple="light"
                            onClick={handleAttemptTest}
                          >
                            Attempt Test
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p className="text-xl font-bold mb-2">No upcoming tests.</p>
            )}

            {pastTests.length > 0 ? (
              <>
                <h2 className="text-xl font-bold mt-8 mb-2">Past Tests</h2>
                <table className="border-collapse border border-black w-full">
                  <thead>
                    <tr>
                      <th className="border border-black px-4 py-2">Sr No.</th>
                      <th className="border border-black px-4 py-2">
                        Test Title
                      </th>
                      <th className="border border-black px-4 py-2">
                        Start Time
                      </th>
                      <th className="border border-black px-4 py-2">
                        Duration
                      </th>
                      <th className="border border-black px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastTests.map((test, index) => (
                      <tr key={test.id}>
                        <td className="border border-black px-4 py-2">
                          {index + 1}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {test.title}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {test.startTime}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {test.duration}
                        </td>
                        <td className="border border-black px-4 py-2">
                          <Button
                            color="blue"
                            ripple="light"
                            onClick={handleViewAnalysis}
                          >
                            View Analysis
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p className=" text-xl font-bold mt-8 mb-2">No Past tests.</p>
            )}

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
