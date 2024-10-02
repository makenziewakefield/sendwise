import { useState, useEffect } from "react";
import axios from "axios";

const useContacts = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data } = await axios.get("/api/contacts");
        setContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  return { contacts };
};

export default useContacts;
