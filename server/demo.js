// app.get("/api/check", (req, res) => {
//     try {
//         res.json({ message: "Server is healthy" });
//     } catch (error) {
//         res.json({ message: "Something went wrong" });
//     }
// });

// app.post("/api/auth/signin", (req, res) => {
//     try {
//         const { email, password, isRemember } = req.body;
//         console.log(email, password, isRemember);

//         if (!email.includes("@")) {
//             res.status(401).json({ message: "Invalid Email!" });
//         }

//         // console.log(req);
//         res.json({ message: "Thank you nigga" });
//     } catch {
//         res.status(500).json({ message: "Internal server error!" });
//     }
// });
