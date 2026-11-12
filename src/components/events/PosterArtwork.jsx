export default function PosterArtwork({ event, past = false }) {
  return (
    <div
      className={`event-poster event-poster--${event.posterTheme || 'default'} ${
        past ? 'is-past' : ''
      }`}
    >
      {event.poster ? (
        <img
          src={event.poster}
          alt={`${event.title} event poster`}
          loading="lazy"
          className="event-poster-image"
        />
      ) : (
        <div className="event-poster-art" aria-hidden="true">
          <span className="poster-orbit poster-orbit-one" />
          <span className="poster-orbit poster-orbit-two" />
          <span className="poster-spark">✳</span>
          <span className="poster-edition">ARTIVERSE · MSIT</span>
          <span className="poster-word">{event.title}</span>
          <span className="poster-year">CREATIVE ARTS / KOLKATA</span>
        </div>
      )}
    </div>
  )
}

