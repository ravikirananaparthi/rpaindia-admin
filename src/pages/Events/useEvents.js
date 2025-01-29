import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import toast from "react-hot-toast";

export function useEvents() {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, orderBy("dateTime"));
      const querySnapshot = await getDocs(q);

      const fetchedEvents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async (eventData) => {
    try {
      const docRef = await addDoc(collection(db, "events"), eventData);
      setEvents((prev) => [...prev, { ...eventData, id: docRef.id }]);
      toast.success("Event added successfully");
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const updateEvent = async (id, updatedEvent) => {
    try {
      const eventRef = doc(db, "events", id);
      await updateDoc(eventRef, updatedEvent);
      toast.success("Event updated successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await deleteDoc(doc(db, "events", id));
      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return { events, addEvent, updateEvent, deleteEvent };
}
