import { resumeFilename, resumePublicPath } from "@/lib/resume-file";
import { asset } from "@/lib/site";

export function ResumeDownload({
  className,
  children = "Download resume",
  ...rest
}: React.ComponentProps<"a">) {
  return (
    <a {...rest} className={className} href={asset(resumePublicPath)} download={resumeFilename}>
      {children}
    </a>
  );
}
