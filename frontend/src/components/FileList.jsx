import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import api from "../api";
import "./FileList.scss";
const FileList = forwardRef((props, ref) => {
    const [items, setItems] = useState([]);


    const load = async () => {
        // Date.now()를 쿼리스트링으로 붙여 캐시를 회피
        const { data } = await api.get("/files", {
            params: { t: Date.now() }
        });
        console.log("GET /files 응답:", data.out);
        setItems(data.out);
    };


    useEffect(() => {
        load();
    }, []);
    // 부모에서 ref.current.load() 호출할 수 있게 노출
    useImperativeHandle(ref, () => ({ load }));


    const del = async (id) => {
        const url = `/files/${id}`

        if (!window.confirm("정말로 삭제하시겠습니까?")) return

        try {
            await api.delete(url)
            await load()

            console.log('파일 삭제 완료', id)
        } catch (error) {
            console.error('파일 삭제 에러', error)
        }
    }

    return (
        <ul className="file-list">
            {items.map((it) => (
                <li
                    key={it._id}
                >
                    <h3>{it.title}</h3>
                    <div className="img-wrap">
                        {it.contentType?.startsWith("image/") && (
                            <img src={it.url} alt="" style={{ maxWidth: 200, display: "block" }} />
                        )}
                    </div>
                    <p>{it.description}</p>
                    <div className="btn-wrap">

                        <a href={it.url} target="_blank" rel="noreferrer" className="open-btn">Open</a>
                        <button
                            onClick={() => del(it._id)}
                            className="delete-btn">Delete</button>
                    </div>
                </li>
            ))}
        </ul>

    )
})

export default FileList