/*
 * Copyright (c) 2025 Aandra Labs B.V.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
*/

'use client'

import { useState, ReactNode } from "react";
import { AandraContext } from "./AandraContext";

interface AandraProviderProps {
  host: string
  public_key: string
  children: ReactNode
}

export function AandraProvider({ children }: AandraProviderProps) {
  const [isFree, setIsFree] = useState(true);
  const [isSignedIn, setSignedIn] = useState(false);
  const [aiUsage, setAIUsage] = useState(0);

  const value = {
    isFree,
    isSignedIn,
    trackAIUsage: () => {
      console.log("[Aandra]: Track AI Usage event");

      setAIUsage(aiUsage + 1);

      if (aiUsage >= 3) {
        setIsFree(false);
      }
    },
    signUp: () => {
      console.log("[Aandra]: SignUp event");
      window.open("https://account.sandbox.aandra.it.com/", "_blank", "noopener,noreferrer")
    },
  };

  return (
    <AandraContext.Provider value={value}>
      {children}
    </AandraContext.Provider>
  );
}
