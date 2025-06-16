"use client";

import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { sanitizeQuillHtml } from "../../utils/index";

type TextEditorProps = {
    onChange?: (html: string) => void;
    defaultContent?: string;
    value?: string;
    id: string;
    label: string;
    required?: boolean;
    readonly?: boolean;
};

export default function TextEditor({
    onChange,
    defaultContent,
    value,
    id,
    label,
    required = false,
    readonly = false,
}: TextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const [quill, setQuill] = useState<Quill | null>(null);
    const isUserChangeRef = useRef(false);
    const initialContent = value || defaultContent || "";

    useEffect(() => {
        if (readonly) return;

        if (editorRef.current && toolbarRef.current && !quill) {
            const q = new Quill(editorRef.current, {
                theme: "snow",
                modules: {
                    toolbar: toolbarRef.current,
                },
            });

            if (initialContent) {
                q.clipboard.dangerouslyPasteHTML(initialContent);
                console.log(initialContent)
            }

            q.on("text-change", () => {
                isUserChangeRef.current = true;
                const html = q.root.innerHTML;
                if (onChange) {
                    onChange(html);
                }
            });

            setQuill(q);
        }
    }, [readonly, editorRef, toolbarRef, quill, initialContent, onChange]);

    useEffect(() => {
        if (quill && value !== undefined && !isUserChangeRef.current) {
            quill.clipboard.dangerouslyPasteHTML(value);
        }
        isUserChangeRef.current = false;
    }, [quill, value]);

    return (
        <div className="w-full space-y-2 mb-2 font-ubuntu">
            {(!readonly || label) && (
                <label htmlFor={id} className="block text-[14px] font-medium text-black font-ubuntu">
                    {label}
                    {required && !readonly && <span className="text-red-400 ml-2">*</span>}
                </label>
            )}

            {readonly ? (

                <div className="quill-content font-ubuntu">
                    <div className="ql-container ql-snow" style={{ border: "none" }}>
                        <div
                            id={id}
                            className="ql-editor text-gray-700"
                            style={{
                                fontFamily: "Ubuntu, sans-serif",
                                padding: 0,
                                margin: 0,
                                fontSize: "14px"
                            }}
                            dangerouslySetInnerHTML={{
                                __html: sanitizeQuillHtml(initialContent),
                            }}
                        />

                    </div>
                </div>
            ) : (
                <div className="border border-gray-300 rounded font-ubuntu">
                    <div
                        ref={toolbarRef}
                        className="px-2 py-1 border-b border-gray-200 bg-gray-50 rounded-t"
                    >
                        <span className="ql-formats">
                            <button className="ql-bold" />
                            <button className="ql-italic" />
                            <button className="ql-underline" />
                        </span>
                        <span className="ql-formats">
                            <button className="ql-list" value="ordered" />
                            <button className="ql-list" value="bullet" />
                        </span>
                    </div>
                    <div
                        id={id}
                        ref={editorRef}
                        className="text-black text-sm min-h-[100px] max-h-[100px] overflow-y-auto focus:outline-none font-ubuntu"
                        style={{
                            padding: 0,
                            fontFamily: "Ubuntu, sans-serif",
                            cursor: "text",
                        }}
                    />
                </div>
            )}
        </div>
    );
}
