import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TestimonialsSection() {
  return (
    <figure className="mx-auto flex w-full max-w-lg flex-col items-center justify-center">
      <div className="mb-8 flex items-center gap-1">
        <span className="font-medium text-lg">Penguin Random House</span>
      </div>

      <blockquote className="text-center text-xl leading-tight tracking-tight sm:text-2xl md:text-3xl">
        &quot;<span className="font-medium">MyNovel.ai</span> is why I still
        have hair. No more worrying about UI blocks.&quot;
      </blockquote>

      <div className="mask-[linear-gradient(to_right,transparent,black,transparent)] mx-auto my-5 h-px w-full max-w-sm bg-border" />

      <figcaption className="flex flex-col items-center gap-5">
        <div className="space-y-0.5 text-center">
          <cite className="font-medium text-foreground text-xl not-italic">
            Gaurav Shrinagesh
          </cite>
          <div className="text-lg text-muted-foreground">
            CEO, Penguin Random House
          </div>
        </div>

        <Avatar className="size-12 rounded-full border object-cover">
          <AvatarImage
            alt="Guillermo Rauch's profile picture"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0aFjJH3dwcKGIzvxfOCbNW3aAf0tBa-s-aQ&s"
          />
          <AvatarFallback>GR</AvatarFallback>
        </Avatar>
      </figcaption>
    </figure>
  );
}
