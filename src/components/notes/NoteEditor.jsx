import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.bubble.css";

const NoteEditor = ({ content, setContent, placeholder = "Write your notes here..." }) => {
  return (
    <ReactQuill
      theme="bubble"
      value={content}
      onChange={setContent}
      placeholder={placeholder}
      className="w-full min-h-[300px] bg-white/80 backdrop-blur-md border border-primary-300/40 shadow rounded-xl text-accent-800 p-4"
      modules={{
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link', 'blockquote', 'code-block'],
          ['clean']
        ],
      }}
      formats={[
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'blockquote', 'code-block'
      ]}
    />
  );
};

export default NoteEditor;