import React from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
} from "@/components/ui/table";
import {Vote} from "@/interfaces/room-component.ts";


interface ScrollUsersProps {
    votes: Vote[];
    votedUsers: string[];
    show: boolean;
    users: string[];
}

const UserTable: React.FC<ScrollUsersProps> = ({users, votes, votedUsers, show}) => {
    function userCardValue(username: string){
        const userVote = votes.find(vote => vote.username === username);
        if(userVote !== undefined){
            return userVote.card.value
        }
        return "did not voted"
    }
    return (
        <div className="w-full max-w-full overflow-hidden">
            <div className="h-auto overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="grid grid-cols-12">
                            <TableHead className="col-span-2 p-2 text-left">User ID</TableHead>
                            <TableHead className="col-span-6 p-2 text-left">User</TableHead>
                            <TableHead className="col-span-2 p-2 text-left">Status</TableHead>
                            {show && <TableHead className="col-span-2">User Vote</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={index} className="grid grid-cols-12">
                                <TableCell className="col-span-2 p-2">{index + 1}</TableCell>
                                <TableCell className="col-span-6 p-2">{user}</TableCell>
                                <TableCell
                                    className="col-span-2 p-2">{(votedUsers.includes(user) ? "voted" : "thinking...")}</TableCell>
                                {show && <TableCell className="col-span-2 p-2">{userCardValue(user)}</TableCell>}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default UserTable;
