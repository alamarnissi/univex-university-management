import './globals.css';
import "@/components/dashboard/calendar/MiniCalendar.css";


export default function RootLayout({children}: { children: React.ReactNode}) {

  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  ) 
  
}