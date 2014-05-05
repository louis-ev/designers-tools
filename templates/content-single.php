<?php while (have_posts()) : the_post(); ?>
  <article class="item" <?php post_class(); ?>>
	<div class="content">
		<header class="name">
	      <h1 class="entry-title"><?php the_title(); ?></h1>
	      <?php get_template_part('templates/entry-meta'); ?>
	    </header>
	    <div class="entry-content description">
	      <?php the_content(); ?>
	    </div>
    <footer>
      <?php wp_link_pages(array('before' => '<nav class="page-nav"><p>' . __('Pages:', 'roots'), 'after' => '</p></nav>')); ?>
    </footer>
  </article>
<?php endwhile; ?>
