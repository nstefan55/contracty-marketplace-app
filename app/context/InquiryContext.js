"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {useSession} from "next-auth/react";
import { getUnreadInquiriesCount } from "@/app/actions/Inquiry/getUnreadInquiriesCount";

//Create Context
const InquiryContext = createContext();

//Create Provider
export function InquiryProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const {data: session} = useSession();

  useEffect(() => {
    if (session && session.user) {
      getUnreadInquiriesCount().then((res) => {
        if (res.countInquiries) setUnreadCount(res.countInquiries);
      })
    }
  }, [getUnreadInquiriesCount, session]);
  return (
    <InquiryContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiryContext() {
  return useContext(InquiryContext);
}
