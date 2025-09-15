import {
  IconCalendarCheck,
  IconCubeSend,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";

const BenefitHighlightSection = () => {
  return (
    <section className="my-12">
      <header className="text-center">
        <h2 className="text-primary text-2xl font-bold lg:text-3xl">
          Best customer service
        </h2>
      </header>

      <main className="container mx-auto mt-8 grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary shadow-none">
          <CardContent className="flex items-center gap-5">
            <div className="flex-center text-center">
              <IconTruckDelivery className="text-primary size-8 lg:size-10" />
            </div>
            <div>
              <CardTitle className="text-primary mb-2 font-semibold">
                Same-day delivery
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                Fast and reliable delivery you can count on.
              </CardDescription>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary shadow-none">
          <CardContent className="flex items-center gap-5">
            <div className="flex-center text-center">
              <IconCalendarCheck className="text-primary size-8 lg:size-10" />
            </div>
            <div>
              <CardTitle className="text-primary mb-2 font-semibold">
                Repeat delivery
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                Set up a schedule and never run out of your pet&apos;s
                essentials.
              </CardDescription>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary shadow-none">
          <CardContent className="flex items-center gap-5">
            <div className="flex-center text-center">
              <IconCubeSend className="text-primary size-10 lg:size-12" />
            </div>
            <div>
              <CardTitle className="text-primary mb-2 font-semibold">
                Curbside pickup
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                Enjoy the convenience of curbside pickup for your orders.
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </main>
    </section>
  );
};
export default BenefitHighlightSection;
