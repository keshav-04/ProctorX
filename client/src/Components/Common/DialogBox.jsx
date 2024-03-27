import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// TODO : Replaces alert with react-toast notification

const DialogBox = ({
    dialogBtnText, dialogHeading, dialogText, dialogConfirmBtnText 
}) => {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [testCode, setTestCode] = useState("");

    const handleOpen = () => setOpen(!open);

    const handleSubmitLink = async(e) => {
        e.preventDefault();
        if (!testCode) {
            console.log("Test code is required");
            alert("Test code is required");

            return ;
        }    
        
        try {
            const access = Cookies.get("access");
            
            if (!access) {
                console.log("Access token not found");
                alert("Access token not found");
                return ;
            }

            const res = await fetch(`${process.env.REACT_APP_API_URL}/getTestID/?test_code=${testCode}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${access}`
                }
            });

            const resData = await res.json();
            if (res.ok) {
                if (resData.ok) {
                    const resMsg = "Test Id fetched successfully";
                    const testId = resData.test_id;  

                    console.log("fetched test_id : ", testId);
                    console.log(resMsg);
                    alert(resMsg);
                    
                    //TODO: navigate to the startTest page along with testId
                    navigate(`/student/registertest`); 
                } else {
                    console.log(`Failed to fetch Test Id : ${resData.error}`);
                    alert("Error in fetching data from server. Please try again later.");
                }
            } else {
                console.log(`Failed to fetch Test Id`);
                alert("Error in fetching data from server. Please try again later.");
            }
        } catch (err) {
            console.log(`ERROR (dialog-box) : ${err.message}`);
            alert("Error in fetching data from server. Please try again later.");
        }       
    };

    return (
        <>
            <Button onClick={handleOpen} variant="gradient" className="rounded-xl m-2">
                {dialogBtnText || "Register Test"}
            </Button>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>{dialogHeading || "Enter Test Code"}</DialogHeader>
                <DialogBody>
                    {dialogText}
                    <Input 
                        label="Test Code" 
                        value={testCode}
                        onChange={(e) => setTestCode(e.target.value)}  
                        required={true}  
                    />
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={(e) => handleSubmitLink(e)}>
                        <span>{dialogConfirmBtnText || "Confirm"}</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export default DialogBox;