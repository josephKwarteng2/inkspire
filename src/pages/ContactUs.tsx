import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-background py-22">
      <div className="text-center mb-10">
        <div className="tracking-widest font-semibold text-foreground/80 text-sm mb-2">
          CONTACT US
        </div>
        <h1 className="font-bold text-3xl md:text-4xl text-foreground m-0">
          Let’s Start a Conversation
        </h1>
        <p className="text-muted-foreground text-base mt-5 max-w-xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim.
        </p>
      </div>
      <div className="max-w-xl mx-auto">
        <Card className="bg-[#592EA9] flex flex-col md:flex-row gap-8 text-white mb-9 p-8 md:p-10 border-none shadow-none">
          <div className="flex-1 min-w-[200px] md:border-r md:border-[--primary-foreground]/20 md:pr-8">
            <div className="text-[15px] opacity-80 mb-2">Working hours</div>
            <div className="font-bold text-lg mb-1">Monday To Friday</div>
            <div className="font-bold text-lg mb-1">9:00 AM to 8:00 PM</div>
            <div className="text-sm opacity-90">
              Our Support Team is available 24/7
            </div>
          </div>
          <div className="flex-1 min-w-[200px] md:pl-8">
            <div className="text-[15px] opacity-80 mb-2">Contact Us</div>
            <div className="font-bold text-lg mb-1">020 7993 2905</div>
            <div className="text-base opacity-95">hello@inkspire.com</div>
          </div>
        </Card>
        <form className="flex flex-col gap-5">
          <Input type="text" placeholder="Full Name" />
          <Input type="email" placeholder="Your Email" />
          <Select defaultValue="">
            <SelectTrigger className="w-full" aria-label="Query Related">
              <SelectValue placeholder="Query Related" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Inquiry</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="feedback">Feedback</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Textarea placeholder="Message" rows={5} />
          <Button
            type="submit"
            className="mt-2 bg-yellow-400 text-[--foreground] font-bold text-lg py-4 rounded-md hover:bg-[--primary] transition-colors"
          >
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
