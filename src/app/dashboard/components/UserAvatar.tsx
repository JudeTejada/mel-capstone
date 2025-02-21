import { Avatar as UIAvatar, AvatarFallback } from "~/components/ui/avatar";

type AvatarProps = {
  firstName: string;
  lastName: string;
  className?: string;
};

export function Avatar({ firstName, lastName, className = "h-12 w-12 border-2 border-gray-200" }: AvatarProps) {
  return (
    <UIAvatar className={className}>
      <AvatarFallback className="bg-primary/10 uppercase text-primary">
        {firstName[0]}
        {lastName[0]}
      </AvatarFallback>
    </UIAvatar>
  );
}