import React from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
} from "@/components/ui/table";
import {Task} from "@/interfaces/room-component.ts";

interface ScrollTableProps {
    task: Task[];
    competedTasks: Task[];
}

const ScrollTable: React.FC<ScrollTableProps> = ({ task, competedTasks }) => {
    const formattedTask = task[0];
    return (
        <div className="w-full max-w-full overflow-hidden">
            <div className="h-auto overflow-y-auto">
                {/* Table Container */}
                <Table>
                    <TableHeader>
                        <TableRow className="grid grid-cols-12">
                            <TableHead className="col-span-2 p-2 text-left">Task ID</TableHead>
                            <TableHead className="col-span-8 p-2 text-left">Task</TableHead>
                            <TableHead className="col-span-2 p-2 text-left">Task Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow key={1} className="grid grid-cols-12">
                            <TableCell className="col-span-2 p-2">1</TableCell>
                            <TableCell className="col-span-8 p-2">{formattedTask.task}</TableCell>
                            <TableCell className="col-span-2 p-2">{formattedTask.taskStatus}</TableCell>
                        </TableRow>
                        {competedTasks.map((task, index) => (
                            <TableRow key={index} className="grid grid-cols-12">
                                <TableCell className="col-span-2 p-2">{index + 2}</TableCell>
                                <TableCell className="col-span-8 p-2">{task.task}</TableCell>
                                <TableCell className="col-span-2 p-2">{task.taskStatus}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ScrollTable;
