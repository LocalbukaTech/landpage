import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, X } from "lucide-react"

interface CommentInputProps {
  onSend?: (text: string) => void;
  replyingTo?: { id: string; username: string } | null;
  onCancelReply?: () => void;
}

export default function CommentInput({ onSend, replyingTo, onCancelReply }: CommentInputProps) {
  const [text, setText] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus when entering reply mode
  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  const handleSend = () => {
    if (!text.trim()) return
    onSend?.(text.trim())
    setText("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSend()
    }
  }

  const isDisabled = !text.trim()

  return (
    <div className="p-3 border-t border-[#3b3b3b] bg-[#2c2c2c] flex flex-col gap-2">
      
      {replyingTo && (
        <div className="flex items-center justify-between text-xs text-neutral-400 px-2 font-medium">
          <span>Replying to {replyingTo.username}...</span>
          <button onClick={onCancelReply} className="hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      <div
        className="
          w-full flex items-center 
          bg-[#1a1a1a] 
          rounded-xl 
          px-4 py-2
          transition
          focus-within:ring-1
          focus-within:ring-[#FFC727]/60
        "
      >
        <input
          ref={inputRef}
          type="text"
          placeholder={replyingTo ? "Write a reply..." : "Add comment..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="
            flex-1 bg-transparent 
            text-white 
            text-[15px] 
            font-medium 
            tracking-[0.01em] 
            leading-none
            focus:outline-none 
            placeholder:text-[#cfcfcf]
          "
        />

        <Button
          size="icon"
          onClick={handleSend}
          disabled={isDisabled}
          className="
            rounded-full 
            bg-[#FFC727] 
            hover:bg-[#FFB800] 
            w-8 h-8 
            flex items-center justify-center 
            shadow-sm
            transition
            active:scale-95
            disabled:opacity-50
            disabled:cursor-not-allowed
            ml-2
          "
        >
          <ArrowUp
            size={16}
            strokeWidth={2.4}
            className="text-black"
          />
        </Button>
      </div>
    </div>
  )
}
