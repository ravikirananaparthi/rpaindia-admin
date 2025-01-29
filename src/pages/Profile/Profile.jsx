import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase.config"; // Ensure your Firebase config is correct
import toast from "react-hot-toast";
import { Timestamp } from "firebase/firestore";
const Profile = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const storedPhoneNumber = localStorage.getItem("ph");
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
      fetchProfileDetails(storedPhoneNumber);
    }
  }, []);

  // Function to fetch profile details based on phoneNumber
  const fetchProfileDetails = async (phone) => {
    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("phoneNumber", "==", phone));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          setFullName(data.fullName || ""); // Set the fullName if it exists
        });
      } else {
        console.log("No user found with the given phone number");
      }
    } catch (error) {
      console.error("Error fetching profile details:", error);
    }
  };

  // Function to update or create the fullName field in Firestore
  const updateProfile = async () => {
    try {
      if (!phoneNumber) {
        toast.error("Phone number is not available.");
        return;
      }
      localStorage.setItem("fullName", fullName);
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("phoneNumber", "==", phoneNumber));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Update existing document
        const userDocRef = doc(db, "users", querySnapshot.docs[0].id);
        await updateDoc(userDocRef, { fullName, createdAt: Timestamp.now() });
        toast.success("Profile updated successfully!");
      } else {
        // Create a new document
        const newUserDocRef = doc(db, "users", phoneNumber); // Use phoneNumber as the document ID
        await setDoc(newUserDocRef, {
          phoneNumber,
          fullName,
          createdAt: Timestamp.now(),
        });
        toast.success("Profile created successfully!");
      }
    } catch (error) {
      console.error("Error updating/creating profile:", error);
      toast.error("Failed to update/create profile.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow m-20">
    
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      <div>
        <p>Phone Number: {phoneNumber}</p>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter Full Name"
          className="border p-2 w-full"
        />
        <button
          onClick={updateProfile}
          className="mt-4 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
