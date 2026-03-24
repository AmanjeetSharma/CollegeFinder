import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { app } from "./src/app.js";
import chalk from "chalk";
import launchPage from "./src/config/launchPage.js"

// loading environment variables
dotenv.config({
    path: "./.env"
});

app.get("/", (req, res) => {
    res.send(launchPage('CollegeFinder'));
});
app.get("/api/v1/health-check", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running smoothly." });
    console.log(chalk.bgMagenta(`[ ${new Date().toLocaleString()} ] Status: Server is healthy.`));
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(chalk.yellowBright(`Server is live! 🚀`));
            console.log(chalk.magentaBright(`🌐 Server is running on port:`));
            console.log(chalk.cyanBright(`http://localhost:${process.env.PORT || 8000}`));
            console.log(chalk.gray(`-----------------------------------------`));
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection failed: ", error);
    });



    // About the website: This project, titled “One-Stop Personalized Career & Education Advisor,” is designed as an online learning and guidance platform specifically for Class 10 and Class 12 students. Its main goal is to help students make informed decisions about their future by offering personalized academic and career guidance. Through features like aptitude-based tests and AI-driven recommendations, the platform suggests suitable subject streams, higher education options, and career paths tailored to each student’s abilities and interests. It also provides reliable information about government colleges, entrance exam eligibility, and scholarship opportunities, all in one place. In addition, the system includes tools such as verified user access through SMS authentication, real-time updates on results and admissions, and progress tracking with reminders. By combining modern web and mobile technologies with intelligent analysis, the platform aims to reduce confusion, improve decision-making, and ultimately lower dropout rates among students while promoting equal access to quality education.