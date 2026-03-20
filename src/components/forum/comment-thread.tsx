"use client";

import { useState } from "react";
import { ArrowBigUp, MessageSquareReply } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { commentsByProductSlug } from "@/data/comments";
import { ProductComment } from "@/types/domain";

function CommentItem({ comment, depth = 0 }: { comment: ProductComment; depth?: number }) {
  const [upvotes, setUpvotes] = useState(comment.upvotes);
  const [replyBoxOpen, setReplyBoxOpen] = useState(false);

  return (
    <div className={depth > 0 ? "ml-8 mt-3 border-l border-white/10 pl-3" : ""}>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <div className="mb-2 flex items-center gap-2">
          <Avatar name={comment.author} className="h-7 w-7" />
          <p className="text-sm font-medium text-white">{comment.author}</p>
          <Badge className="text-[10px]">{comment.authorBadge}</Badge>
          <span className="text-xs text-white/50">{comment.createdAt}</span>
        </div>
        <p className="text-sm text-white/85">{comment.content}</p>
        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setUpvotes((value) => value + 1)}>
            <ArrowBigUp className="h-4 w-4" />
            {upvotes}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setReplyBoxOpen((value) => !value)}>
            <MessageSquareReply className="h-4 w-4" />
            Reply
          </Button>
        </div>
        {replyBoxOpen ? <Input className="mt-3" placeholder="Write a reply..." /> : null}
      </div>

      {comment.replies?.map((reply) => <CommentItem key={reply.id} comment={reply} depth={depth + 1} />)}
    </div>
  );
}

interface CommentThreadProps {
  productSlug: string;
}

export function CommentThread({ productSlug }: CommentThreadProps) {
  const comments = commentsByProductSlug[productSlug] ?? [];

  return (
    <section className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-2xl">
      <h3 className="mb-3 text-base font-semibold text-white">Discussion</h3>
      <Input placeholder="Share your thoughts..." className="mb-3" />
      <div className="space-y-3">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </section>
  );
}
