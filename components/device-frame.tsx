import { Media } from "@/components/media";
import type { Shot } from "@/lib/projects";

export function DeviceFrame({ shot, priority = false }: { shot: Shot; priority?: boolean }) {
  const phone = shot.height > shot.width;
  return (
    <figure className={phone ? "device device-phone" : "device device-desktop"}>
      <div className="device-chrome" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <Media
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        priority={priority}
        sizes={phone ? "22rem" : "(min-width: 960px) 960px, 100vw"}
      />
    </figure>
  );
}
