import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BulkActionDialogsProps {
  selectedPostsCount: number;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  onConfirmBulkDelete: () => void;
  showPublishDialog: boolean;
  setShowPublishDialog: (show: boolean) => void;
  onConfirmBulkPublish: () => void;
  showScheduleModal: boolean;
  setShowScheduleModal: (show: boolean) => void;
  showScheduleConfirm: boolean;
  setShowScheduleConfirm: (show: boolean) => void;
  scheduleDate: string;
  setScheduleDate: (date: string) => void;
  onConfirmBulkSchedule: () => void;
}

const BulkActionDialogs: React.FC<BulkActionDialogsProps> = ({
  selectedPostsCount,
  showDeleteDialog,
  setShowDeleteDialog,
  onConfirmBulkDelete,
  showPublishDialog,
  setShowPublishDialog,
  onConfirmBulkPublish,
  showScheduleModal,
  setShowScheduleModal,
  showScheduleConfirm,
  setShowScheduleConfirm,
  scheduleDate,
  setScheduleDate,
  onConfirmBulkSchedule,
}) => {
  return (
    <>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete {selectedPostsCount} post
              {selectedPostsCount > 1 ? "s" : ""}?
            </DialogTitle>
          </DialogHeader>
          <p className="mb-4">
            Are you sure you want to delete the selected post
            {selectedPostsCount > 1 ? "s" : ""}? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmBulkDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Publish {selectedPostsCount} post
              {selectedPostsCount > 1 ? "s" : ""}?
            </DialogTitle>
          </DialogHeader>
          <p className="mb-4">
            Are you sure you want to publish the selected post
            {selectedPostsCount > 1 ? "s" : ""}?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPublishDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={onConfirmBulkPublish}>Publish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Schedule {selectedPostsCount} post
              {selectedPostsCount > 1 ? "s" : ""}
            </DialogTitle>
          </DialogHeader>
          <input
            type="datetime-local"
            className="w-full border rounded p-2 mb-4"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowScheduleModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setShowScheduleConfirm(true)}
              disabled={!scheduleDate}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showScheduleConfirm} onOpenChange={setShowScheduleConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Schedule</DialogTitle>
          </DialogHeader>
          <p className="mb-4">
            Are you sure you want to schedule {selectedPostsCount} post
            {selectedPostsCount > 1 ? "s" : ""} for{" "}
            {scheduleDate ? new Date(scheduleDate).toLocaleString() : ""}?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowScheduleConfirm(false)}
            >
              Cancel
            </Button>
            <Button onClick={onConfirmBulkSchedule}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BulkActionDialogs;
