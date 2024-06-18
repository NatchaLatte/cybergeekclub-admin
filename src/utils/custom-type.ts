export interface Account {
    email: string;
    password: string;
}

export interface DashboardData {
    accountAdminAmount: number;
    accountMemberAmount: number;
    accountCertifiedAmount: number;
    budgetAmount: number;
    expenditureAmount: number;
    balanceAmount: number;
}

const prefix_th = ["นาย", "นาง", "นางสาว"];
const prefix_en = ["Mr.", "Mrs.", "Miss", "Ms."];
const code = ["R01","R02","R03","R04","R05","R06","R08","R09","R10","R11","R12","R13","R14","R15","R16","R17","R20","R21","R22","R23","R24","R25","R32","R33","T02","T03","T04","T05","T07","T08","T12","T13","T14","T17","T18","T19","T20","T22","T23","S01","S02","S03","S04","S05","S06","S08","S09","S10","S11","S18","S19","S20","G01","G02","M01","M02","M03","M04","M05","M07","M09"]
const faculty_th = ["คณะวิทยาการจัดการ","คณะวิศวกรรมศาสตร์ ศรีราชา","คณะวิทยาศาสตร์ ศรีราชา","คณะเศรษฐศาสตร์ ศรีราชา","คณะพาณิชยนาวีนานาชาติ"];
const faculty_en = ["Faculty of Management Sciences","Faculty of Engineering at Sriracha","Faculty of Science at Sriracha","Faculty of Economics at Sriracha","Faculty of International Maritime Studies", "Marine Engineering (2017 revision)","Nautical Science","Maritime Transportation","Naval Architecture and Ocean Engineering","Marine Engineering"];
const major_th = ["สาขาวิชาการเงิน","สาขาวิชาการจัดการ","สาขาวิชาการตลาด","สาขาวิชาธุรกิจระหว่างประเทศ","สาขาวิชาการจัดการโรงแรมและท่องเที่ยว","สาขาวิชาการโรงแรม","สาขาวิชาการบัญชีบริหาร","สาขาวิชาการจัดการโลจิสติกส์","สาขาวิชาการเงินและการลงทุน","สาขาวิชาการจัดการโรงแรม","สาขาวิชาการจัดการการท่องเที่ยวร่วมสมัย","สาขาวิชาการบัญชี","สาขาวิชาการตลาดดิจิทัลและการสร้างตรา","สาขาวิชาวิศวกรรมคอมพิวเตอร์","สาขาวิชาวิศวกรรมเครื่องกล","สาขาวิชาวิศวกรรมไฟฟ้า","สาขาวิชาวิศวกรรมโยธา","สาขาวิชาวิศวกรรมอุตสาหการ","สาขาวิชาวิศวกรรมเครื่องกลและการผลิต","สาขาวิชาวิศวกรรมคอมพิวเตอร์และสารสนเทศศาสตร์","สาขาวิชาวิศวกรรมเครื่องกลและการออกแบบ","สาขาวิชาวิศวกรรมไฟฟ้าและอิเล็กทรอนิกส์","สาขาวิชาวิศวกรรมอุตสาหการและระบบ","สาขาวิชาวิศวกรรมระบบการผลิตดิจิทัล","สาขาวิชาวิศวกรรมดิจิทัลและอิเล็กทรอนิกส์อัจฉริยะ","สาขาวิชาวิศวกรรมเครื่องกลและระบบการผลิต","สาขาวิชาวิศวกรรมหุ่นยนต์และระบบอัตโนมัติ","สาขาวิชาวิศวกรรมยานยนต์","สาขาวิชาวิทยาการคอมพิวเตอร์","สาขาวิชาวิทยาศาสตร์สิ่งแวดล้อม","สาขาวิชาเทคโนโลยีสารสนเทศ","สาขาวิชาเคมี","สาขาวิชาวิทยาศาสตร์และเทคโนโลยีเคมีประยุกต์","สาขาวิชาคณิตศาสตร์ประยุกต์","สาขาวิชาวิทยาการวิเคราะห์ข้อมูลและคณิตศาสตร์ประกันภัย","สาขาวิชาฟิสิกส์","สาขาวิชาวิทยาศาสตร์และเทคโนโลยีสิ่งแวดล้อม","สาขาวิชาวิทยาการและเทคโนโลยีดิจิทัล","สาขาวิชาเศรษฐศาสตร์","สาขาวิชาวิศวกรรมต่อเรือและเครื่องกลเรือ","สาขาวิชาวิศวกรรมต่อเรือและเครื่องกลเรือ ปรับปรุงปี 2560","สาขาวิชาวิทยาศาสตร์การเดินเรือ","สาขาวิชาการขนส่งทางทะเล","สาขาวิชาวิศวกรรมต่อเรือและวิศวกรรมสมุทรศาสตร์","สาขาวิชาวิศวกรรมเครื่องกลเรือ"];
const major_en = ["Finance","Management","Marketing","International Business","Hotel and Tourism Management","Hotel Studies","Managerial Accounting","Logistics Management","Finance and Investment","Hotel Management","Contemporary Tourism Management","Accounting","Digital Marketing and Branding","Computer Engineering","Mechanical Engineering","Electrical Engineering","Civil Engineering","Industrial Engineering","Mechanical and Manufacturing Engineering","Computer Engineering and Informatics","Mechanical and Design Engineering","Electrical and Electronics Engineering","Industrial and Systems Engineering","Digital Manufacturing System Engineering","Digital and Smart Electronics Engineering","Mechanical Engineering and Production System","Robotic and Automation Systems Engineering","Automotive Engineering","Computer Science","Environmental Science","Information Technology","Chemistry","Applied Chemical Science and Technology","Applied Mathematics","Data Analytics and Actuarial Science","Physics","Environmental Science and Technology","Digital Science and Technology","Economics","Naval Architecture and Marine Engineering","Naval Architecture and"];
export { prefix_th, prefix_en, faculty_th, faculty_en, major_th, major_en, code };