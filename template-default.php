<?php
/*
Template Name: Default
*/
?>

<?php

$child_pages = new WP_Query( array(
    'post_type'      => 'post', // set the post type to page
    'posts_per_page' => 100, // number of posts (pages) to show
) ); ?>

<?php get_template_part('templates/page', 'header'); ?>

<?php while ($child_pages->have_posts()) : $child_pages->the_post() ?>
	<article class="" <?php post_class(); ?>>
		<div class="content">
			<header class="name">
				<div class="meta">
					<?php get_template_part('templates/entry-meta'); ?>
				</div>
				<a href="<?php the_permalink(); ?>"><h2><?php the_title(); ?></h2></a>
			</header>
			<div class="entry-summary description">
				<?php the_content(); ?>
			</div>
		</div>
	</article>
<?php endwhile; ?>

<?php if ($wp_query->max_num_pages > 1) : ?>
  <nav class="post-nav">
    <ul class="pager">
      <li class="previous"><?php next_posts_link(__('&larr; Older posts', 'roots')); ?></li>
      <li class="next"><?php previous_posts_link(__('Newer posts &rarr;', 'roots')); ?></li>
    </ul>
  </nav>
<?php endif; ?>
