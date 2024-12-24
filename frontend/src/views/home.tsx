import * as React from "react";
import {Button} from "@/components/ui/button.tsx";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import socket from "@/service/socket.ts";
import {useNavigate} from "react-router-dom";
import {CreateRoomRequest, CreateRoomResponse} from "@/interfaces/room.ts";

export default function Home() {
    const navigate = useNavigate();
    const [roomRule, setRoomRule] = React.useState("");
    const [roomName, setRoomName] = React.useState("");
    const [addTask, setAddTask] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState({
        "roomName": 2,
        "addTask": 2,
        "roomRule": 2,
        "incAmount": 2,
    })
    const [firstClick, setFirstClick] = React.useState(false);
    const [incAmount, setIncAmount] = React.useState("");
    const [isEmpty, setIsEmpty] = React.useState({
        "roomName": 2,
        "addTask": 2,
        "roomRule": 2,
        "incAmount": 2,
    })
    React.useEffect(() => {
        socket.connect();
        socket.on("createRoom", (msg: CreateRoomResponse) => {
            sessionStorage.setItem('key', msg.key);
            navigate(`/${msg.sessionId}`);
            socket.disconnect();
        });
    }, [navigate]);

    React.useEffect(() => {
        if (firstClick) {
            setErrorMessage(prevState => ({
                ...prevState,
                roomName: roomName.trim() !== "" ? 1 : 0,
                addTask: addTask.trim() !== "" ? 1 : 0,
                roomRule: roomRule.trim() !== "" ? 1 : 0,
                incAmount: incAmount.trim() === ""
                    ? 0
                    : roomRule === "arithmetic"
                        ? (incAmount.trim() === "" || isNaN(parseInt(incAmount)))
                            ? 0
                            : 1
                        : 1,
            }));
        }
        setIsEmpty(prev => ({
            ...prev,
            roomName: roomName.trim() !== "" ? 1 : 0,
            addTask: addTask.trim() !== "" ? 1 : 0,
            roomRule: roomRule.trim() !== "" ? 1 : 0,
            incAmount: roomRule.trim() === ""
                ? 0
                : roomRule === "arithmetic"
                    ? (incAmount.trim() === "" || isNaN(parseInt(incAmount)))
                        ? 0
                        : 1
                    : 1,
        }));
    }, [addTask.length, firstClick, incAmount, roomName, roomRule])
    const createRoom = () => {
        const roomData: CreateRoomRequest = {
            roomName,
            roomRule,
            task: addTask,
            incAmount: incAmount
        };
        console.log(roomData)
        socket.emit("createRoom", roomData);
    }

    const validateForm = () => {
        setFirstClick(true);
        if (Object.values(isEmpty).every(value => value === 1)) {
            createRoom()
        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center flex-col gap-4">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Create Scrum Poker</CardTitle>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="roomname">Room Name</Label>
                                <Input
                                    required={true}
                                    id="roomname"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    placeholder="Name of your room"
                                />
                                {!errorMessage.roomName && (
                                    <p className="text-red-500 text-sm">{"This field not be empty."}</p>
                                )}
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="addtask">Add Task</Label>
                                <div className="flex flex-row">
                                    <Input
                                        id="addtask"
                                        value={addTask}
                                        onChange={(e) => setAddTask(e.target.value)}
                                        placeholder="Enter task name"
                                    />
                                </div>
                                {!errorMessage.addTask && (
                                    <p className="text-red-500 text-sm">{"You should add task."}</p>
                                )}
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="roomrule">Room Rule</Label>
                                <Select onValueChange={(value) => setRoomRule(value)}>
                                    <SelectTrigger id="roomrule">
                                        <SelectValue placeholder="Select"/>
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="standard">Standard</SelectItem>
                                        <SelectItem value="fibonacci">Fibonacci</SelectItem>
                                        <SelectItem value="arithmetic">Arithmetic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {!errorMessage.roomRule && (
                                <p className="text-red-500 text-sm">{"You should select the rule of you want room rule"}</p>
                            )}
                            {roomRule === "arithmetic" && (
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="cardnumber">Increase Amount</Label>
                                    <Input
                                        id="cardnumber"
                                        value={incAmount}
                                        onChange={(e) => setIncAmount(e.target.value)}
                                        placeholder="How many cards do you want?"
                                    />
                                </div>
                            )}
                            {!errorMessage.incAmount && roomRule === "arithmetic" && (
                                <p className="text-red-500 text-sm">{"You should enter the number of you want increase amount and it should be a number."}</p>
                            )}
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={validateForm}>Create Room</Button>
                </CardFooter>
            </Card>
            <Separator className="gap-4"/>
        </div>
    );
}
