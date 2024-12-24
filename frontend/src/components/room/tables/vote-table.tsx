import React, { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
} from "@/components/ui/table";

interface ScrollUsersProps {
    votes: string[];
}

const VoteTable: React.FC<ScrollUsersProps> = ({ votes }) => {
    const [voteFrequency, setVoteFrequency] = useState<{ [key: string]: number }>({});
    function average() {
        const numbers = votes
            .map(Number)  // Convert each item to a number (non-numeric values become NaN)
            .filter(num => !isNaN(num));  // Filter out NaN values

        if (numbers.length === 0) return 0; // Handle case where there are no numeric values

        const total = numbers.reduce((sum, num) => sum + num, 0);
        return Math.round(total / numbers.length);
    }

    useEffect(() => {
        const frequencyCount: { [key: string]: number } = {};
        votes.forEach(vote => {
            frequencyCount[vote] = (frequencyCount[vote] || 0) + 1;
        });
        setVoteFrequency(frequencyCount);

    }, [votes]);
    return (
        <div className="w-full max-w-full overflow-hidden">
            <div className="h-auto overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="grid grid-cols-12">
                            <TableHead className="col-span-6 p-2 text-left">Vote</TableHead>
                            <TableHead className="col-span-6 p-2 text-left">Vote Count</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.keys(voteFrequency).map((voteKey, index) => (
                            <TableRow key={index} className="grid grid-cols-12">
                                <TableCell className="col-span-6 p-2">{voteKey}</TableCell>
                                <TableCell className="col-span-6 p-2">
                                    {voteFrequency[voteKey] || 0}
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow className="grid grid-cols-12">
                            <TableCell className="col-span-6 p-2">Average</TableCell>
                            <TableCell className="col-span-6 p-2">{isNaN(average()) ? (0):(average())}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default VoteTable;
