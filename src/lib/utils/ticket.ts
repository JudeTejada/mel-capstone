import { type ProgressStatus } from "@prisma/client";

export const getStatusColor = (status: ProgressStatus) => {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-blue-500";
    case "DONE":
      return "bg-green-500";
    case "ON_HOLD":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

export const getFormattedStatus = (status: ProgressStatus) => {
  switch (status) {
    case "IN_PROGRESS":
      return "In Progress";
    case "DONE":
      return "Completed";
    case "ON_HOLD":
      return "On Hold";
    default:
      return status;
  }
};
