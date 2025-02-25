import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CircleIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";



export const statuses = [
  {
    value: "TODO",
    label: "To do",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "INPROGRESS",
    label: "In progress",
    icon: CircleIcon,
  },
  {
    value: "COMPLETED",
    label: "Completed",
    icon: StopwatchIcon,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "LOW",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "MEDIUM",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "HIGH",
    icon: ArrowUpIcon,
  },
];
