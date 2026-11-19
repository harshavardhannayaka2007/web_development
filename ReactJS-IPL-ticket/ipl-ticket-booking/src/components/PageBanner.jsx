function PageBanner({ tone, eyebrow, title, description, image, imageAlt }) {
  return (
    <section className={`page-banner page-banner--${tone}`}>
      <div className="page-banner-copy">
        <span className="page-banner-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <img className="page-banner-image" src={image} alt={imageAlt} />
    </section>
  )
}

export default PageBanner
