import { Jost } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";

const font = Jost({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface HeaderProps {
  label: string;
}

const Header = ({ label }: HeaderProps) => {
  return (
    <div className="">
      <div className="flex items-center gap-3 group">
        <div className="">
          <div className="" />
          <Image 
            src="/igleadlogo.png" 
            alt="Logo" 
            width={50} 
            height={50}
            className=""
          />
        </div>
        <h1 className={cn(
          
          font.className
        )}>
          IgLeadGen
        </h1>
      </div>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
};

export default Header;