import React, { useEffect, useState } from "react";

function App() {
  const [post, setPost] = useState(null);
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(false);
  const postId = 1; // 🔹 ID do post no banco de dados

  useEffect(() => {
    if (!postId) return;
    setLoading(true);

    // 1️⃣ Busca informações do post (usuário, comentário, albumId)
    fetch(`http://localhost:3000/api/posts/${postId}`)
      .then((res) => res.json())
      .then((postData) => {
        setPost(postData);

        // 2️⃣ Em seguida, busca informações do álbum
        return fetch(`http://localhost:3000/api_audiodb/v1/lookup/album/${postData.albumId}`);
      })
      .then((res) => res.json())
      .then((albumData) => {
        if (albumData.album && albumData.album.length > 0) {
          setAlbum(albumData.album[0]);
        } else {
          setAlbum(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar dados:", err);
        setLoading(false);
        setPost(null);
        setAlbum(null);
      });
  }, [postId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0d0d0d] text-[#FEF4EA]">
        Carregando...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0d0d0d] text-[#FEF4EA]">
        Post não encontrado.
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8 bg-[#0d0d0d] min-h-screen">
      <div className="post flex flex-col bg-[#1a1a1a] text-[#FEF4EA] rounded-2xl shadow-lg p-5 gap-5 w-full max-w-md">
        {/* Cabeçalho */}
        <div className="post_header flex items-center gap-3">
          <div className="post_pfp w-10 h-10 rounded-full overflow-hidden border border-gray-500 shrink-0">
            <img
              src={post.userpic}
              alt={post.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="post_username flex flex-col">
            <h1 className="font-semibold text-base leading-tight">{post.username}</h1>
            <h2 className="text-xs opacity-70">{post.timeAgo}</h2>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="post_content flex flex-col gap-4">
          {/* Álbum */}
          <div className="post_album flex items-center bg-[#262626] p-4 rounded-xl gap-4">
            {album ? (
              <>
                <div className="post_album_pic flex-shrink-0 w-32 h-32">
                  {album.strAlbumThumb ? (
                    <img
                      src={album.strAlbumThumb}
                      alt={album.strAlbum}
                      className="w-full h-full object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center text-sm">
                      No cover
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center flex-1 text-left gap-2">
                  <div className="post_album_name text-lg font-semibold">
                    {album.strAlbum || "Untitled Album"}
                  </div>
                  <div className="post_band_name text-base opacity-80">
                    {album.strArtist || "Unknown Artist"}
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full text-center py-8 text-[#FEF4EA]">Álbum não encontrado.</div>
            )}
          </div>

          {/* Comentário */}
          <div className="post_comment bg-[#262626] rounded-xl p-4 text-sm text-gray-300">
            {post.comment || "Sem comentário."}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
