import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

interface CommentInputProps {
  onSend?: (text: string) => void
}

export default function CommentInput({ onSend }: CommentInputProps) {
  const [text, setText] = useState("")

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
    <div className="p-3 border-t border-[#3b3b3b] bg-[#2c2c2c] flex items-center justify-center">
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
          type="text"
          placeholder="Add comment"
          value={text}
          autoFocus
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
