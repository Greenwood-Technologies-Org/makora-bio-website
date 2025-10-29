import React from "react";

function EmailDetailPanel({ email, onClose }) {
  const aiDraftReply = `Dear ${
    email.sender.split(" ")[1]
  },\n\nThank you for reaching out regarding ${email.subject.toLowerCase()}. I've reviewed your message and would like to address your concerns.\n\n[AI-generated response based on context and similar past communications]\n\nPlease let me know if you need any additional information.\n\nBest regards,\nClinical Operations Team`;

  const aiReferences = [
    { type: "Document", title: "Protocol Amendment v2.3", date: "2025-10-15" },
    {
      type: "Email Thread",
      title: "Re: Similar query from Site 102",
      date: "2025-10-10",
    },
    {
      type: "Document",
      title: "IRB Guidelines - Amendment Process",
      date: "2025-09-28",
    },
  ];

  return (
    <div className="w-96 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {email.subject}
            </h3>
            <p className="text-sm text-gray-600">{email.sender}</p>
            <p className="text-xs text-gray-500 mt-1">{email.timestamp}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Email Content */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Message</h4>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
            {email.content}
          </div>
        </div>

        {/*  Reply */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700"></span>
            Draft Reply
          </h4>
          <textarea
            className="w-full h-48 p-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            defaultValue={aiDraftReply}
          />
          <div className="flex gap-2 mt-2">
            <button className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm">
              Send Reply
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
              Edit
            </button>
          </div>
        </div>

        {/* AI References */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            AI References
          </h4>
          <div className="space-y-2">
            {aiReferences.map((ref, index) => (
              <div
                key={index}
                className="p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-blue-700">
                        {ref.type}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {ref.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{ref.date}</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailDetailPanel;
