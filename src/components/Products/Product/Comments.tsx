"use client";
import { useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import {
  DeleteComment,
  GetComments,
  PostComment,
} from "@/services/shopActions";
import TextareaAutosize from "react-textarea-autosize";
import { BsChatLeftText } from "react-icons/bs";
import { IoIosMore } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { formatToPersianTimeAgo } from "@/utils/formatToPersianTimeAgo";
import { addToast } from "@heroui/toast";
import ProductButton from "@/components/ProtectButton";

interface Comment {
  id: number;
  product_id: number;
  user_full_name: string;
  text: string;
  created_at: string;
  parent: number | null;
  replies: Comment[];
}

export default function Comments({
  productId,
  comments: initialComments,
}: {
  productId: number;
  comments: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState<string>("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [openReplies, setOpenReplies] = useState<Record<number, boolean>>({});
  const [openMoreMenu, setOpenMoreMenu] = useState<number | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    try {
      setSubmitting(true);
      await PostComment(productId, { text, parent: replyTo });
      setText("");
      setReplyTo(null);
      const updated = await GetComments(productId);
      setComments(updated);
    } catch (error) {
      console.error("خطا در ارسال نظر:", error);
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async (commentId: number) => {
    try {
      await DeleteComment(commentId);
      const updated = await GetComments(productId);
      setComments(updated);
      addToast({
        title: "موفقیت‌آمیز",
        description: "نظر با موفقیت حذف شد.",
        color: "success",
      });
    } catch (error: any) {
      addToast({
        title: error.message,
        color: "danger",
      });
    }
  };

  const renderComment = (comment: Comment) => {
    const isOpen = openReplies[comment.id] ?? false;

    return (
      <div key={comment.id} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 text-sm mt-3 shadow-lg text-zinc-900">
        <p className="font-bold text-red-700">{comment.user_full_name}</p>

        <p className="text-zinc-500 text-xs">
          {formatToPersianTimeAgo(comment.created_at)}
        </p>
        <p className="mt-2">{comment.text}</p>

        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={() => {
              setReplyTo(comment.id);
              setText("");
            }}
            className="text-red-700 hover:text-red-900 underline-offset-4 text-xs hover:underline flex items-center gap-1 font-bold"
          >
            <BsChatLeftText className="size-4" /> پاسخ
          </button>
          <div
            onClick={() =>
              setOpenMoreMenu((prev) =>
                prev === comment.id ? null : comment.id
              )
            }
            ref={moreMenuRef}
            className="relative"
          >
            <div className="hover:text-red-700 text-zinc-500 cursor-pointer">
              <IoIosMore className="size-6" />
            </div>

            {openMoreMenu === comment.id && (
                <div className="absolute left-0 top-4 mt-1 z-10 bg-white border border-zinc-200 rounded-xl shadow-xl text-xs overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const confirmed = window.confirm(
                      "آیا از حذف این نظر مطمئن هستید؟"
                    );
                    if (confirmed) {
                      handleDelete(comment.id);
                      setOpenMoreMenu(null);
                    }
                  }}
                  className="flex items-center whitespace-nowrap gap-1 w-full text-danger hover:bg-red-50 px-4 py-2 text-right"
                >
                  <FaTrashAlt className="size-4" /> حذف نظر
                </button>
              </div>
            )}
          </div>
          {comment.replies.length > 0 && (
            <button
              onClick={() =>
                setOpenReplies((prev) => ({
                  ...prev,
                  [comment.id]: !isOpen,
                }))
              }
              className="flex items-center text-gray-600 text-xs hover:underline"
            >
              {isOpen ? (
                <>
                  <FaChevronUp className="ml-1" />
                  بستن پاسخ‌ها
                </>
              ) : (
                <>
                  <FaChevronDown className="ml-1" />
                  دیدن پاسخ‌ها ({comment.replies.length})
                </>
              )}
            </button>
          )}
        </div>

        {replyTo === comment.id && (
          <div className="mt-4">
            <TextareaAutosize
              minRows={3}
              className="w-full border border-zinc-300 bg-zinc-50 rounded-xl p-3 text-xs sm:text-sm text-zinc-900 focus:border-red-500 outline-none"
              placeholder="پاسخ خود را بنویسید..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex items-center gap-3 mt-2">
              <ProductButton
                disabled={submitting}
                onClick={handleSubmit}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold text-xs"
              >
                {submitting ? "در حال ارسال..." : "ارسال پاسخ"}
              </ProductButton>
              <button
                onClick={() => {
                  setText("");
                  setReplyTo(null);
                }}
                className="text-gray-600 text-sm hover:underline"
              >
                انصراف
              </button>
            </div>
          </div>
        )}

        {isOpen && comment.replies.length > 0 && (
          <div className="mt-4 pl-4 border-r border-gray-300 space-y-2">
            {comment.replies.map((reply) => renderComment(reply))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full space-y-5">
      <div>
        <p className="text-base font-bold">شما هم می‌توانید نظر بدهید</p>

        <div className="mt-3">
          {replyTo === null && (
            <>
              <TextareaAutosize
                minRows={3}
                className="w-full border border-zinc-300 bg-zinc-50 rounded-xl p-3 text-xs sm:text-sm text-zinc-900 focus:border-red-500 outline-none"
                placeholder="نظر خود را بنویسید..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex items-center gap-3 mt-2">
                <ProductButton
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white font-bold text-xs"
                >
                  {submitting ? "در حال ارسال..." : "ارسال نظر"}
                </ProductButton>
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        <p className="text-white font-bold text-sm mb-2">
          نظرات کاربران | {comments.length} مورد
        </p>
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">هنوز نظری ثبت نشده است.</p>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  );
}
