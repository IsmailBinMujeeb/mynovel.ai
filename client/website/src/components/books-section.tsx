import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const BOOKS = [
  "https://marketplace.canva.com/EAFihRgw0cI/2/0/1003w/canva-beige-and-black-simple-science-fiction-book-cover-pug7SdX02F8.jpg",
  "https://template.canva.com/EAFZWF3UxYg/1/0/251w-V8PDHE3HvAI.jpg",
  "https://template.canva.com/EAFpNMjYutw/2/0/251w-XBsZpWhcA0Y.jpg",
  "https://template.canva.com/EAG2QliftgE/1/0/251w-VRIr2nBP6sw.jpg",
  "https://template.canva.com/EAFaQMYuZbo/1/0/251w-8gQRC2EsUU8.jpg",
];

export default function BooksSection() {
  return (
    <Carousel className="w-full max-w-5xl mx-auto mb-16">
      <CarouselContent className="-ml-1">
        {BOOKS.map((link, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <img src={link} alt="" className="size-full" />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
