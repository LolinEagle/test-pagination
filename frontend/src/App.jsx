import { useState, useEffect } from "react";

const API_URL = "/api/products";

export default function App() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Constructing the URL with parameters
        const params = new URLSearchParams({
          page,
          category,
          sort,
          order,
          limit: 10,
        });

        const response = await fetch(`${API_URL}?${params.toString()}`);
        if (!response.ok) throw new Error("Erreur réseau");

        const data = await response.json();
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, category, sort, order]); // Recharge when these values ​​change

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Catalogue produits</h1>
        <div className="filters">
          <select value={category} onChange={handleCategoryChange}>
            <option value="">Toutes categories</option>
            <option value="shoes">Chaussures</option>
            <option value="clothing">Vetements</option>
            <option value="accessories">Accessoires</option>
            <option value="bags">Sacs</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="createdAt">Date</option>
            <option value="price">Prix</option>
            <option value="name">Nom</option>
          </select>
          <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="asc">Croissant</option>
            <option value="desc">Decroissant</option>
          </select>
        </div>
      </div>

      {loading && <p className="loading">Chargement...</p>}
      {error && <p className="error">Erreur : {error}</p>}

      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <p className="empty">Aucun produit trouvé.</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="price">
                    <strong>{product.price} €</strong>
                  </p>
                  <small className="category">Catégorie: {product.category}</small>
                </div>
              ))}
            </div>
          )}

          {pagination && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(1)}>
                Début
              </button>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Précédente
              </button>
              <span className="page-info">
                Page <strong>{page}</strong> sur{" "}
                <strong>{pagination.totalPages}</strong>
              </span>
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Suivante
              </button>
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage(pagination.totalPages)}
              >
                Fin
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
