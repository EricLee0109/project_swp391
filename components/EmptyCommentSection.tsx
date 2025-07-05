import React from "react";
import { MessageCircle, PlusCircle } from "lucide-react";

interface EmptyCommentsProps {
  title?: string;
  description?: string;
  showIcon?: boolean;
  showActionButton?: boolean;
  actionButtonText?: string;
  onActionClick?: () => void;
  className?: string;
}

const EmptyComments: React.FC<EmptyCommentsProps> = ({
  title = "No comments yet",
  description = "Be the first to share your thoughts on this post!",
  showIcon = true,
  showActionButton = true,
  actionButtonText = "Add Comment",
  onActionClick,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    >
      {showIcon && (
        <div className="mb-4">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto" />
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>

      <p className="text-gray-500 text-sm mb-6 max-w-md">{description}</p>

      {showActionButton && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {actionButtonText}
        </button>
      )}
    </div>
  );
};

export default EmptyComments;
