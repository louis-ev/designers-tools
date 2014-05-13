<?php
/*
Template Name: Timeline
*/
?>

<?php

$child_pages = new WP_Query( array(
    'post_type'      => 'post', // set the post type to page
    'posts_per_page' => 100, // number of posts (pages) to show
) ); ?>

<div class="ui stackable items">
<?php while ($child_pages->have_posts()) : $child_pages->the_post() ?>

	<?php
	$minpassed = ( current_time( 'timestamp', 0 ) - get_post_time('U', false) ) / 60;
	$auteurpos = ( (get_the_author_meta('ID')-1) / count(get_users()) ) * 100;

	$minpassedpercent = ( $minpassed / 18767 ) *100;

	?>
	<article class="item inspace" <?php post_class(); ?> style="top: <?php echo $minpassed ?>px; left: <?php echo $auteurpos ?>%" data-auteur="<?php echo get_the_author_meta('ID')?>" data-minutesecoulees="<?php echo $minpassed ?>">
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
</div>

<div class="backgrid">
<?php
for ($x=0; $x<=280; $x++)
  {
  echo "<hr>";
  }
?>
</div>

<?php if ($wp_query->max_num_pages > 1) : ?>
  <nav class="post-nav">
    <ul class="pager">
      <li class="previous"><?php next_posts_link(__('&larr; Older posts', 'roots')); ?></li>
      <li class="next"><?php previous_posts_link(__('Newer posts &rarr;', 'roots')); ?></li>
    </ul>
  </nav>
<?php endif; ?>
