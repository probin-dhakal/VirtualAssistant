import jwt from "jsonwebtoken";

const generateToken = async (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "30d" // Token will expire in 30 days
        });
        return token; // ✅ RETURN THE TOKEN
    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Token generation failed");
    }
};

export default generateToken;
