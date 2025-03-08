import React , { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
  });
  const closeRef = React.useRef<HTMLButtonElement>(null);


  const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get("/api/user/announcements", {withCredentials: true });
        if(res?.data){
          setAnnouncements(res?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAnnouncements();
  }, []); 


  const handleSubmit = async() => {
    try {
      const res = await axios.post("/api/admin/create_announcement", formData, {withCredentials: true});
      if(res?.data){
        toast.success(res?.data?.message);
        setAnnouncements([...announcements, res?.data?.announcement]);
        closeRef?.current?.click();
      }
    } catch (error) {
      toast.error("Failed to create announcement.");
    } finally {
      setFormData({
        subject: "",
        body: "",
      });
    }
  }

  const getDate = (date: Date) => {
    const dateObj = new Date(date);

    return dateObj.toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Announcements</h1>
          <Dialog>
          <DialogClose ref={closeRef}/>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New Announcement</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Enter announcement subject" value={formData?.subject} onChange={onChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="body">Body</Label>
                  <Textarea
                    id="body"
                    value={formData?.body}
                    placeholder="Enter announcement details"
                    onChange={onChange}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSubmit}>Create Announcement</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Body</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((announcement) => (
                <TableRow key={announcement._id}>
                  <TableCell className="font-medium">
                    {announcement.subject}
                  </TableCell>
                  <TableCell>{announcement.body}</TableCell>
                  <TableCell>{getDate(announcement?.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
};

export default AdminAnnouncements;