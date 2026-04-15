"use client";

import { useState } from "react";
import { ArrowBigUp, MessageSquareReply } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupabaseComments, SupabaseComment } from "@/hooks/use-supabase-comments";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";

function CommentItem({
  comment,
  depth = 0,
  onReply,
}: {
  comment: SupabaseComment;
  depth?: number;
  onReply: (content: string, parentId: string) => void;
}) {
  const locale = useUiStore((state) => state.locale);
  const [upvotes, setUpvotes] = useState(comment.upvotes);
  const [replyBoxOpen, setReplyBoxOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const timeAgo = (() => {
    const diff = Date.now() - new Date(comment.created_at).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return locale === "tr" ? "az önce" : "just now";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  })();

  return (
    <div className={depth > 0 ? cn("mt-3 border-l border-white/10 pl-3", depth <= 2 ? "ml-8" : "ml-2") : ""}>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <div className="mb-2 flex items-center gap-2">
          <Avatar name={comment.author_name} className="h-7 w-7" />
          <p className="text-sm font-medium text-white">{comment.author_name}</p>
          <Badge className="text-[10px]">{comment.author_badge}</Badge>
          <span className="text-xs text-white/50">{timeAgo}</span>
        </div>
        <p className="text-sm text-white/85">{comment.content}</p>
        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setUpvotes((v) => v + 1)}>
            <ArrowBigUp className="h-4 w-4" />
            {upvotes}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setReplyBoxOpen((v) => !v)}>
            <MessageSquareReply className="h-4 w-4" />
            {t(locale, "reply")}
          </Button>
        </div>
        {replyBoxOpen ? (
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!replyText.trim()) return;
              onReply(replyText.trim(), comment.id);
              setReplyText("");
              setReplyBoxOpen(false);
            }}
          >
            <Input
              placeholder={t(locale, "writeReply")}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="primary" size="sm">
              {t(locale, "reply")}
            </Button>
          </form>
        ) : null}
      </div>

      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} />
      ))}
    </div>
  );
}

interface CommentThreadProps {
  productId: string;
  productSlug: string;
}

export function CommentThread({ productId }: CommentThreadProps) {
  const locale = useUiStore((state) => state.locale);
  const { comments, loading, addComment } = useSupabaseComments(productId);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  return (
    <section className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-2xl">
      <h3 className="mb-3 text-base font-semibold text-white">{t(locale, "discussion")}</h3>
      <form
        className="mb-3 flex flex-col gap-2 sm:flex-row"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!newComment.trim()) return;
          await addComment(newComment, authorName || "Anonymous");
          setNewComment("");
        }}
      >
        <Input
          placeholder={locale === "tr" ? "Adınız" : "Your name"}
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full sm:w-32"
        />
        <Input
          placeholder={t(locale, "shareThoughts")}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="primary" size="sm">
          {locale === "tr" ? "Gönder" : "Post"}
        </Button>
      </form>

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(content, parentId) => addComment(content, authorName || "Anonymous", parentId)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/50">
          {locale === "tr" ? "Henüz yorum yok. İlk yorumu sen yaz!" : "No comments yet. Be the first!"}
        </p>
      )}
    </section>
  );
}
