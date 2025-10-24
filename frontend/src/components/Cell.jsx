// frontend/src/components/Cell.jsx
export default function Cell({ value, onClick }) {
return (
<button className="cell" onClick={onClick} aria-label="cell">
{value}
</button>
);
}